const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});

var vpool = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}

export async function createFacility(facility_type, capacity) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO facilities (facility_type, capacity) VALUES (?, ?)", [facility_type, capacity]);
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
        const rows = await conn.query("SELECT * FROM facilities WHERE active = true");
        return rows;
    } catch (error) {
        console.error('Error retrieving facilities:', error);
        throw new Error('Error retrieving facilities');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function deleteFacility(facility_id) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE facilities SET active = false WHERE facilities_id = ?", [facility_id]);
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
