const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});

var vpool = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}

export async function logScan(tag_id, location_id, time, inout) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO logs (keyfob_id, faciliteit_id, timestamp, in_out) VALUES (?, ?, ?, ?)", [tag_id, location_id, time, inout]);
        return result;
    } catch (error) {
        console.error('Error logging scan:', error);
        throw new Error('Error logging scan');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function getScans() {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM logs");
        return rows;
    } catch (error) {
        console.error('Error retrieving scans:', error);
        throw new Error('Error retrieving scans');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}