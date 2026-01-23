import express from 'express';
import { toSerializable } from '../helpers/serializable.js';
import { getUsers, deleteUser, updateUser } from '../helpers/users.js';

const router = express.Router();

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
        return res.status(400).json({ error: 'User ID is vereist' });
    }
    try {
        let result = await deleteUser(userId);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Gebruiker verwijderd', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

router.put('/update-user/:id', async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is vereist' });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is vereist' });
    }
    const userData = req.body;
    try {
        let result = await updateUser(userId, userData);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Gebruiker aangepast', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});




export default router;