const express = require('express');
const router = express.Router();

router.post('/scans', async (req, res) => {
    
});

router.get('/scans', async (req, res) => {
    res.status(200).json({ message: 'OK' });
});

module.exports = router;