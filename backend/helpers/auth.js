const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});
const nodemailer = require('nodemailer');
import { hashPassword, comparePassword, generateOTP } from "./passwordHandler.js";

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false   ,
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

export async function createUser(firstName, lastName, affix, email, username, role) {
    const pool = mariadb.createPool(vpool);
    let conn;

    try {
        conn = await pool.getConnection();
        const otp = generateOTP();
        const hashedPassword = await hashPassword(otp);
        const result = await conn.query("INSERT INTO users (voornaam, achternaam, tussenvoegsel, rol, email, username, wachtwoord) VALUES (?, ?, ?, ?, ?, ?, ?)", [firstName, lastName, affix, role, email, username, hashedPassword]);

        // await sendMail(otp); TODOOOO
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    } finally {
        if (conn) conn.release();
    }
}

export async function testData() {
    const pool = mariadb.createPool(vpool);
    let conn;

    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT * FROM users");
        return rows;
    } catch (error) {
        console.error('Error fetching test data:', error);
        throw new Error('Error fetching test data');
    } finally {
        if (conn) conn.release();
        await pool.end();
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
        console.log('Email sent:', info.response || info);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}