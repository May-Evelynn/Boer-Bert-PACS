const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});

var vpool = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}

export async function createFacility(facilityType, capacity) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO faciliteiten (faciliteit_type, capacity) VALUES (?, ?)", [facilityType, capacity]);
        return result;
    } catch (error) {
        console.error('Error creating facility:', error);
        throw new Error('Error creating facility');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function getFacilities() {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM faciliteiten WHERE active = true");
        return rows;
    } catch (error) {
        console.error('Error retrieving facilities:', error);
        throw new Error('Error retrieving facilities');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function deleteFacility(facilityId) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE faciliteiten SET active = false WHERE faciliteiten_id = ?", [facilityId]);
        return result;
    } catch (error) {
        console.error('Error deleting facility:', error);
        throw new Error('Error deleting facility');
    }
    finally {
        if (conn) conn.release();
        await pool.end();
    }
}
