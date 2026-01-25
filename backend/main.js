import express from 'express';
import cors from 'cors';

import adminRoute from './routes/adminRoute.js';
import authRoute from './routes/authRoute.js';
import druppelRoute from './routes/druppelRoute.js';
import facilityRoute from './routes/facilityRoute.js';
import usersRoute from './routes/usersRoute.js';
import guestRoute from './routes/guestRoute.js';

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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.use('/api/admin', adminRoute);
app.use('/api/auth', authRoute);
app.use('/api/druppel', druppelRoute);
app.use('/api/facility', facilityRoute);
app.use('/api/users', usersRoute);
app.use('/api/guests', guestRoute);

// Fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
