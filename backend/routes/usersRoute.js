const express = require('express');
const router = express.Router();
const { toSerializable } = require('../helpers/serializable.js');
const { getUsers, deleteUser, updateUser } = require('../helpers/users.js');

router.get('/', async (req, res) => {
    try {
        let result = await getUsers();
        const safeResult = toSerializable(result);
        return res.status(200).json({ users: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});
router.delete('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        let result = await deleteUser(userId);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'User deleted successfully', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

router.put('/update-user/:id', async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }
    const userData = req.body;
    try {
        let result = await updateUser(userId, userData);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'User updated successfully', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});




module.exports = router;