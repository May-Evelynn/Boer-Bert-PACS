import mariadb from 'mariadb';
import dotenv from 'dotenv';
import { hashPassword } from './helpers/passwordHandler.js';

dotenv.config({ quiet: true });

const vpool = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password'; // Change this!
const ADMIN_EMAIL = 'admin@admin.com';

async function initAdmin() {
    const pool = mariadb.createPool(vpool);
    let conn;

    try {
        conn = await pool.getConnection();

        // Check if admin user exists
        const rows = await conn.query(
            "SELECT * FROM users WHERE username = ? AND active = true",
            [ADMIN_USERNAME]
        );

        if (rows && rows.length > 0) {
            console.log('Admin user already exists.');
            return;
        }

        // Create admin user
        const hashedPassword = await hashPassword(ADMIN_PASSWORD);
        await conn.query(
            "INSERT INTO users (first_name, last_name, affix, role, email, username, password, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ['Admin', 'User', '', 'admin', ADMIN_EMAIL, ADMIN_USERNAME, hashedPassword, true]
        );

        console.log('Admin user created successfully.');
        console.log(`Username: ${ADMIN_USERNAME}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
    } catch (error) {
        console.error('Error initializing admin:', error);
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

initAdmin();
