import express from 'express';
import { toSerializable } from '../helpers/serializable.js';
import { createUser, sendMail } from '../helpers/auth.js';

const router = express.Router();

router.post('/create-user', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    let { first_name, last_name, affix, email, username, role } = req.body || {};
    const requiredFields = ['first_name', 'last_name', 'email', 'username'];
    const dataArr = [first_name, last_name, email, username];

    const missingFields = requiredFields.filter((_, index) => dataArr[index] == null || dataArr[index] === '');
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing field(s): ${missingFields.join(', ')}` });
    }

    if (affix == null) affix = '';
    if (role == null) role = '';

    try {
        let result = await createUser(first_name, last_name, affix, email, username, role);
        const safeResult = toSerializable(result);
        return res.status(201).json({ message: 'User registered successfully', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

export default router;