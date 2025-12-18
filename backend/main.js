const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use((err, req, res, next) => {
    if (err && (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err))) {
        console.error('Invalid JSON payload received:', err.message || err);
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next(err);
});

// best wel lenient, later dichtzetten
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

const adminRoute = require('./routes/adminRoute');
const authRoute = require('./routes/authRoute');
const druppelRoute = require('./routes/druppelRoute');
const facilityRoute = require('./routes/facilityRoute');

app.use('/api/admin', adminRoute);
app.use('/api/auth', authRoute);
app.use('/api/druppel', druppelRoute);
app.use('/api/facility', facilityRoute);

// Fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
