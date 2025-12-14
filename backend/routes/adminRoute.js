const express = require('express');
const router = express.Router();
const { toSerializable } = require('../helpers/serializable.js');

const { createUser, sendMail } = require('../helpers/auth.js');

router.post('/create-user', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    const { firstName, lastName, affix, email, username, role } = req.body || {};
    const dataArr = [firstName, lastName, affix, email, username, role];
    const dataNames = ['firstName', 'lastName', 'affix', 'email', 'username', 'role'];

    const missingFields = dataNames.filter((_, index) => dataArr[index] == null);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing field(s): ${missingFields.join(', ')}` });
    }

    try {
        let result = await createUser(firstName, lastName, affix, email, username, role);
        const safeResult = toSerializable(result);
        return res.status(201).json({ message: 'User registered successfully', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

module.exports = router;