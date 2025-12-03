const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});
import { hashPassword, comparePassword } from "./passwordHandler.js";

var vpool = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}

export async function registerUser(fullName, email, password, username) {
    const pool = mariadb.createPool(vpool);
    let conn;

    // todo
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
