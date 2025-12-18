const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});
const nodemailer = require('nodemailer');
const { hashPassword, comparePassword, generateOTP, generateToken, verifyToken } = require("./passwordHandler.js");

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

var vpool = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}

export async function createUser(first_name, last_name, affix, email, username, role) {
    const pool = mariadb.createPool(vpool);
    let conn;

    try {
        conn = await pool.getConnection();
        const otp = generateOTP();
        // console.log('Generated OTP:', otp);
        const hashedPassword = await hashPassword(otp);
        const result = await conn.query("INSERT INTO users (first_name, last_name, affix, role, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)", [first_name, last_name, affix, role, email, username, hashedPassword]);

        // await sendMail(otp); TODOOOO
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    } finally {
        if (conn) conn.release();
    }
}

export async function sendMail(otp, toEmail) {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: toEmail,
        subject: 'Your One-Time Password (OTP)',
        text: `Your OTP is: ${otp}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        // console.log('Email sent:', info.response || info);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function loginUser(username, password) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE username = ?", [username]);
        if (!rows || rows.length === 0) {
            throw new Error('User not found');
        }

        const user = rows[0];
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const payload = {
            id: user.id || user.ID || user.user_id || null,
            username: user.username,
            role: user.role,
            email: user.email
        };

        const token = await generateToken(payload);

        let { wachtwoord, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error('Error logging in user');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function changePassword(username, oldPassword, newPassword) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE username = ?", [username]);
        if (!rows || rows.length === 0) {
            throw new Error('Gebruiker niet gevonden');
        }
        const user = rows[0];
        const isOldPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new Error('Oud wachtwoord is onjuist');
        }
        const hashedNewPassword = await hashPassword(newPassword);
        await conn.query("UPDATE users SET password = ?, is_first_login = 0 WHERE username = ?", [hashedNewPassword, username]);
        return { message: 'Wachtwoord succesvol gewijzigd' };
    } catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Er is een fout opgetreden bij het wijzigen van het wachtwoord');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}