const express = require('express');
const router = express.Router();
const { logScan, getScans, attachUserToKeyfob, detachUserFromKeyfob, setKeyfobKey, initNewKeyfob } = require('../helpers/scans.js');
const { toSerializable } = require('../helpers/serializable.js');

router.post('/scans', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }
    
    let { tag_id, location_id, inout } = req.body || {};
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
    try {
        let result = await getScans();
        const safeResult = toSerializable(result);
        return res.status(200).json({ scans: safeResult });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve scans', details: error.message });
    }
});

router.put('/attach-user', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    let { userId, keyfobId } = req.body || {};
    const dataArr = [userId, keyfobId];
    const dataNames = ['userId', 'keyfobId'];

    const missingFields = dataNames.filter((_, index) => dataArr[index] == null);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing field(s): ${missingFields.join(', ')}` });
    }

    // Type validation
    if (typeof userId !== 'number' || typeof keyfobId !== 'number') {
        return res.status(400).json({ error: "'userId' and 'keyfobId' must be numbers" });
    }

    try {
        let result = await attachUserToKeyfob(userId, keyfobId);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'User attached to keyfob successfully', result: safeResult });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to attach user to keyfob', details: error.message });
    }

});

router.put('/detach-user', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    let { keyfobId } = req.body || {};
    if (keyfobId == null) {
        return res.status(400).json({ error: 'Missing field: keyfobId' });
    }

    // Type validation
    if (typeof keyfobId !== 'number') {
        return res.status(400).json({ error: "'keyfobId' must be a number" });
    }
    try {
        let result = await detachUserFromKeyfob(keyfobId);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'User detached from keyfob successfully', result: safeResult });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to detach user from keyfob', details: error.message });
    }
});

router.put('/set-keyfob-key', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    let { keyfobId, newKey } = req.body || {};
    const dataArr = [keyfobId, newKey];
    const dataNames = ['keyfobId', 'newKey'];
    const missingFields = dataNames.filter((_, index) => dataArr[index] == null);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing field(s): ${missingFields.join(', ')}` });
    }

    // Type validation
    if (typeof keyfobId !== 'number' || typeof newKey !== 'number') {
        return res.status(400).json({ error: "'keyfobId' and 'newKey' must be numbers" });
    }
    try {
        let result = await setKeyfobKey(keyfobId, newKey);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Keyfob key set successfully', result: safeResult });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to set keyfob key', details: error.message });
    }
});

router.get('/keyfobs', async (req, res) => {
    try {
        let result = await getKeyfobs();
        const safeResult = toSerializable(result);
        return res.status(200).json({ keyfobs: safeResult });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve keyfobs', details: error.message });
    }
});

router.put('/init-keyfob', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is empty' });
        }

        let { keyfob_key } = req.body || {};        
        let result = await initNewKeyfob(keyfob_key);
        return res.status(200).json({ keyfob: keyfob_key + ' successfully created' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to initialize keyfob', details: error.message });
    }
});


module.exports = router;