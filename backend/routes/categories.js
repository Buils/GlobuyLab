const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取所有分类
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json({ code: 200, message: '获取分类成功', data: rows });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
    }
});

module.exports = router;