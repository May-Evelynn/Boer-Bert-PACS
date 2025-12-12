const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

const adminRoute = require('./routes/adminRoute');
const authRoute = require('./routes/authRoute');
const druppelRoute = require('./routes/drupperRoute');

app.use('/api/admin', adminRoute);
app.use('/api/auth', authRoute);
app.use('/api/druppel', druppelRoute);

// Fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
