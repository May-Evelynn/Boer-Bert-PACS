import mariadb from 'mariadb';
import nodemailer from 'nodemailer';
import { hashPassword, comparePassword, generateOTP, generateToken, verifyToken } from './passwordHandler.js';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

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
        console.log('Generated OTP:', otp);
        const hashedPassword = await hashPassword(otp);
        const result = await conn.query("INSERT INTO users (first_name, last_name, affix, role, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)", [first_name, last_name, affix, role, email, username, hashedPassword]);

        await sendMail(otp, email);
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function sendMail(otp, toEmail) {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: toEmail,
        subject: 'BoerBert - Wachtwoord reset',
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">BoerBert - Wachtwoord Reset</h2>
            <p style="font-size: 16px; color: #34495e;">Beste gebruiker,</p>
            <p style="font-size: 16px; color: #34495e;">U heeft een verzoek ingediend om uw wachtwoord te resetten.</p>
            <p style="font-size: 16px; color: #34495e;">Uw eenmalige wachtwoord (OTP) is:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #34495e;">Als u dit verzoek niet heeft ingediend, kunt u deze e-mail negeren.</p>
            <p style="font-size: 16px; color: #34495e;">Met vriendelijke groet,</p>
            <p style="font-size: 16px; color: #34495e;"><strong>BoerBert</strong></p>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response || info);
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
            throw new Error('Gebruiker niet gevonden');
        }

        const user = rows[0];
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Ongeldig wachtwoord');
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
        throw error;
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

export async function OTPintoResetPassword(username) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE username = ?", [username]);
        if (!rows || rows.length === 0) {
            throw new Error('User not found');
        }
        const user = rows[0];
        const otp = generateOTP();
        const hashedOTP = await hashPassword(otp);
        await conn.query("UPDATE users SET password = ?, is_first_login = 1 WHERE username = ?", [hashedOTP, username]);
        await sendMail(otp, user.email);
        return { message: 'OTP sent to email' };
    } catch (error) {
        console.error('Error resetting password with OTP:', error);
        throw new Error('Error resetting password with OTP');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}