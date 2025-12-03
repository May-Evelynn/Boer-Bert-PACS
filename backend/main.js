const express = require('express');
import { testData } from './auth.js'

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.get('/test', async (req, res) => {
    try {
        const data = await testData();
        return res.status(200).json(data);
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

