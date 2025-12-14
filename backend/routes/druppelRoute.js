const express = require('express');
const router = express.Router();
const { logScan } = require('../helpers/scans.js');
const { toSerializable } = require('../helpers/serializable.js');

router.post('/scans', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }
    
    const { tag_id, location_id, inout } = req.body || {};
    const dataArr = [tag_id, location_id, inout];
    const dataNames = ['tag_id', 'location_id', 'inout'];
    
    const missingFields = dataNames.filter((_, index) => dataArr[index] == null);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing field(s): ${missingFields.join(', ')}` });
    }

    // Type validation
    if (typeof tag_id !== 'number' || typeof location_id !== 'number') {
        return res.status(400).json({ error: "'tag_id' and 'location_id' must be numbers" });
    }
    if (typeof inout !== 'string') {
        return res.status(400).json({ error: "'inout' must be a string" });
    }

    if (inout !== 'in' && inout !== 'out') {
        return res.status(400).json({ error: "Invalid value for 'inout'. Must be 'in' or 'out'." });
    }
    
    let time = Date.now();
    
    try {
        let result = await logScan(tag_id, location_id, time, inout);
        const safeResult = toSerializable(result);
        return res.status(201).json({ message: 'Scan logged successfully', result: safeResult });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to log scan', details: error.message });
    }
});

router.get('/scans', async (req, res) => {
    // 
});

module.exports = router;