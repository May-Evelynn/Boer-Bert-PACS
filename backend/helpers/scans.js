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

export async function attachUserToKeyfob(userId, keyfobId) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET attached_user_id = ? WHERE keyfob_id = ?", [userId, keyfobId]);
        return result;
    } catch (error) {
        console.error('Error attaching user to keyfob:', error);
        throw new Error('Error attaching user to keyfob');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function detachUserFromKeyfob(keyfobId) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET attached_user_id = NULL WHERE keyfob_id = ?", [keyfobId]);
        return result;
    } catch (error) {
        console.error('Error detaching user from keyfob:', error);
        throw new Error('Error detaching user from keyfob');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function setKeyfobKey(keyfobId, newKey) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET keyfob_key = ? WHERE keyfob_id = ?", [newKey, keyfobId]);
        return result;
    } catch (error) {
        console.error('Error setting keyfob key:', error);
        throw new Error('Error setting keyfob key');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function getKeyfobs() {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM keyfobs WHERE kapot = 0");
        return rows;
    } catch (error) {
        console.error('Error retrieving keyfobs:', error);
        throw new Error('Error retrieving keyfobs');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

