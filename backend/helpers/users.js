const mariadb = require('mariadb');
const dotenv = require('dotenv').config({quiet: true});

var vpool = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}

export async function getUsers() {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE active = true");
        return rows.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw new Error('Error retrieving users');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function deleteUser(user_id) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await
            conn.query("UPDATE users SET active = false WHERE user_id = ?", [user_id]);
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

export async function updateUser(user_id, userData) {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const fields = Object.keys(userData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(userData);
        values.push(user_id);
        const sql = `UPDATE users SET ${fields} WHERE user_id = ?`;
        const result = await conn.query(sql, values);
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}
