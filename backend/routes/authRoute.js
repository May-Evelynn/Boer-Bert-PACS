const express = require('express');
const router = express.Router();
const { createUser, sendMail, loginUser, changePassword } = require('../helpers/auth.js'); 

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const loginResult = await loginUser(username, password);
        return res.status(200).json({ message: 'Login successful', ...loginResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

router.post('/change-password', async (req, res) => {
    let { username, oldPassword, newPassword } = req.body;
    
    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Username, old password, and new password are required' });
    }
    try {
        const changeResult = await changePassword(username, oldPassword, newPassword);
        return res.status(200).json({ message: 'Password changed successfully', ...changeResult });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

module.exports = router;