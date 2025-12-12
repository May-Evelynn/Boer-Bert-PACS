const express = require('express');
import { testData, createUser, sendMail, loginUser } from './auth.js'

const app = express();
app.use(express.json());

app.use((err, req, res, next) => {
    if (err && (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err))) {
        console.error('Invalid JSON payload received:', err.message || err);
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next(err);
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.post('/admin/createUser', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }
    
    const { firstName, lastName, affix, email, username, role} = req.body || {};
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

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
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

// Fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

function toSerializable(value) {
    if (value === null || value === undefined) return value;
    if (typeof value === 'bigint') {
        const num = Number(value);
        return Number.isSafeInteger(num) ? num : value.toString();
    }
    if (Array.isArray(value)) return value.map(toSerializable);
    if (typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, toSerializable(v)])
        );
    }
    return value;
}
