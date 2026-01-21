const express = require('express');
const router = express.Router();
const mariadb = require('mariadb');
const dotenv = require('dotenv').config({ quiet: true });
const { toSerializable } = require('../helpers/serializable.js');

var vpool = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

router.get('/', async (req, res) => {
    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE (role IS NULL OR role = '') AND active = true");
        const safeResult = toSerializable(rows.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }));
        return res.status(200).json({ guests: safeResult });
    } catch (error) {
        console.error('Error retrieving guests:', error);
        return res.status(500).json({ error: 'Failed to retrieve guests', details: error.message });
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
});

router.post('/', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    let { first_name, last_name, affix } = req.body || {};

    if (!first_name || first_name.trim() === '') {
        return res.status(400).json({ error: 'first_name is required' });
    }
    if (!last_name || last_name.trim() === '') {
        return res.status(400).json({ error: 'last_name is required' });
    }

    if (affix == null) affix = '';

    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            "INSERT INTO users (first_name, last_name, affix, role, email, username, password, active) VALUES (?, ?, ?, '', '', '', '', true)",
            [first_name.trim(), last_name.trim(), affix.trim()]
        );
        const safeResult = toSerializable(result);
        return res.status(201).json({ message: 'Guest created successfully', result: safeResult });
    } catch (error) {
        console.error('Error creating guest:', error);
        return res.status(500).json({ error: 'Failed to create guest', details: error.message });
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
});

router.put('/:id', async (req, res) => {
    const guestId = req.params.id;
    if (!guestId) {
        return res.status(400).json({ error: 'Guest ID is required' });
    }

    let { first_name, last_name, affix } = req.body || {};

    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const updates = [];
        const values = [];

        if (first_name !== undefined) {
            updates.push('first_name = ?');
            values.push(first_name.trim());
        }
        if (last_name !== undefined) {
            updates.push('last_name = ?');
            values.push(last_name.trim());
        }
        if (affix !== undefined) {
            updates.push('affix = ?');
            values.push(affix.trim());
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(guestId);
        const result = await conn.query(
            `UPDATE users SET ${updates.join(', ')} WHERE user_id = ? AND (role IS NULL OR role = '')`,
            values
        );
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Guest updated successfully', result: safeResult });
    } catch (error) {
        console.error('Error updating guest:', error);
        return res.status(500).json({ error: 'Failed to update guest', details: error.message });
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
});

router.delete('/:id', async (req, res) => {
    const guestId = req.params.id;
    if (!guestId) {
        return res.status(400).json({ error: 'Guest ID is required' });
    }

    const pool = mariadb.createPool(vpool);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            "UPDATE users SET active = false WHERE user_id = ? AND (role IS NULL OR role = '')",
            [guestId]
        );
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Guest deleted successfully', result: safeResult });
    } catch (error) {
        console.error('Error deleting guest:', error);
        return res.status(500).json({ error: 'Failed to delete guest', details: error.message });
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
});

module.exports = router;
