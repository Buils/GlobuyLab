const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    const { email, message } = req.body;
    await db.query('INSERT INTO feedbacks (email, message) VALUES (?, ?)', [email, message]);
    res.json({ code: 200, message: '反馈提交成功' });
});

router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
    res.json({ code: 200, data: rows });
});

module.exports = router;