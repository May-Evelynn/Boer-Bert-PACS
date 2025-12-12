const express = require('express');
const router = express.Router();

router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    // TODO
});

module.exports = router;