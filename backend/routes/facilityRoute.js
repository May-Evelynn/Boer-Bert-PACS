import express from 'express';
import { toSerializable } from '../helpers/serializable.js';
import { createFacility, getFacilities, updateFacility, deleteFacility } from '../helpers/facility.js';

const router = express.Router();

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
        if (isNaN(parsed)) return res.status(400).json({ error: "'capacity' moet een nummer zijn" });
        capacity = parsed;
    }

    try {
        let result = await createFacility(facilityType, capacity);
        const safeResult = toSerializable(result);
        return res.status(201).json({ message: 'Faciliteit aangemaakt', result: safeResult });
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

router.put('/update-facility/:id', async (req, res) => {
    const facilityId = req.params.id;
    if (!facilityId) {
        return res.status(400).json({ error: 'Facility ID is vereist' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    const { facilityType, capacity, active, broken } = req.body;

    try {
        let result = await updateFacility(facilityId, {
            facility_type: facilityType,
            capacity: capacity,
            active: active !== undefined ? active : true,
            broken: broken !== undefined ? broken : false
        });
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Faciliteit bijgewerkt', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

router.delete('/delete-facility/:id', async (req, res) => {
    const facilityId = req.params.id;
    if (!facilityId) {
        return res.status(400).json({ error: 'Facility ID is vereist' });
    }
    try {
        let result = await deleteFacility(facilityId);
        const safeResult = toSerializable(result);
        return res.status(200).json({ message: 'Faciliteit verwijderd', result: safeResult });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

export default router;