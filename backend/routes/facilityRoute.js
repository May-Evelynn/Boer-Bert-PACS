const express = require('express');
const router = express.Router();
const { toSerializable } = require('../helpers/serializable.js');
const { createFacility, getFacilities, updateFacility } = require('../helpers/facility.js');

router.put('/create-facility', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }
    
    let { facilityType, capacity } = req.body || {};
    const dataArr = [facilityType, capacity];
    const dataNames = ['facilityType', 'capacity'];
    const missingFields = dataNames.filter((_, index) => dataArr[index] == null);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing field(s): ${missingFields.join(', ')}` });
    }

    if (typeof capacity !== 'number') {
        const parsed = parseInt(capacity, 10);
        if (isNaN(parsed)) return res.status(400).json({ error: "'capacity' must be a number" });
        capacity = parsed;
    }

    try {
        let result = await createFacility(facilityType, capacity);
        const safeResult = toSerializable(result);
        return res.status(201).json({ message: 'Facility created successfully', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

router.get('/facilities', async (req, res) => {
    try {
        let result = await getFacilities();
        const safeResult = toSerializable(result);
        return res.status(200).json({ facilities: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

router.delete('/delete-facility/:id', async (req, res) => {
    const facilityId = req.params.id;
    if (!facilityId) {
        return res.status(400).json({ error: 'Facility ID is required' });
    }
    try {
        let result = await deleteFacility(facilityId);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Facility deleted successfully', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

router.patch('/update-facility/:id', async (req, res) => {
    const facilityId = req.params.id;
    if (!facilityId) {
        return res.status(400).json({ error: 'Facility ID is required' });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    let { facility_type, capacity, active } = req.body || {};

    try {
        let result = await updateFacility(facilityId, { facility_type, capacity, active });
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Facility updated successfully', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});


module.exports = router;