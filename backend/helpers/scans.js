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
        let allowed = await verifyAllowed(tag_id) ? 1 : 0;
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO logs (keyfob_id, facility_id, timestamp, in_out, allowed) VALUES (?, ?, ?, ?, ?)", [tag_id, location_id, time, inout, allowed]);
        if (allowed === 1) {
            return { message: 'Access granted', state: 1, logResult: "Scan logged with grant" };
        } else {
            return { message: 'Access denied', state: 0, logResult: "Scan logged with denial" };
        }
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

export async function attachUserToKeyfob(user_id, keyfob_id) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET attached_user_id = ? WHERE keyfob_id = ?", [user_id, keyfob_id]);
        return result;
    } catch (error) {
        console.error('Error attaching user to keyfob:', error);
        throw new Error('Error attaching user to keyfob');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function detachUserFromKeyfob(keyfob_id) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET attached_user_id = NULL WHERE keyfob_id = ?", [keyfob_id]);
        return result;
    } catch (error) {
        console.error('Error detaching user from keyfob:', error);
        throw new Error('Error detaching user from keyfob');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function setKeyfobKey(keyfob_id, new_key) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE keyfobs SET keyfob_key = ? WHERE keyfob_id = ?", [new_key, keyfob_id]);
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
        const rows = await conn.query("SELECT * FROM keyfobs WHERE buitengebruik = 0");
        return rows;
    } catch (error) {
        console.error('Error retrieving keyfobs:', error);
        throw new Error('Error retrieving keyfobs');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function initNewKeyfob(keyfob_key) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO keyfobs (keyfob_key) VALUES (?)", keyfob_key);
        return result;
    } catch (error) {
        console.error('Error initializing keyfob: ', error)
        throw new Error('Error initializing keyfob')
    } finally {
        if (conn) {conn.release();}
        await pool.end();
    }
}

async function verifyAllowed(keyfob_id) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM keyfobs WHERE keyfob_id = ? AND attached_user_id IS NOT NULL AND buitengebruik = 0", [keyfob_id]);
        return rows.length > 0;
    } catch (error) {
        console.error('Error verifying keyfob access:', error);
        throw new Error('Error verifying keyfob access');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}