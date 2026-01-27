import express from 'express';
import { sendMail, loginUser, changePassword, OTPintoResetPassword } from '../helpers/auth.js';

const router = express.Router(); 

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const loginResult = await loginUser(username, password);
        return res.status(200).json({ message: 'Login successful', ...loginResult });
    } catch (err) {
        if (err.message === 'Gebruiker niet gevonden' || err.message === 'Ongeldig wachtwoord') {
            return res.status(401).json({ message: 'Gebruikersnaam of wachtwoord is onjuist' });
        }
        return res.status(500).json({ message: err.message || 'Internal Server Error' });
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

router.post('/reset-password-otp', async (req, res) => {
    let { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const resetResult = await OTPintoResetPassword(username);
        return res.status(200).json({ message: 'OTP sent successfully', ...resetResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

export default router;