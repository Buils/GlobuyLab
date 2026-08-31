const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取商品列表接口
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json({
            code: 200,
            message: '获取商品列表成功',
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
});

// 新增商品
router.post('/', async (req, res) => {
    const { name, price, description } = req.body;
    const [result] = await db.query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description]);
    res.json({ code: 200, message: '添加成功', data: { id: result.insertId } });
});

// 修改商品
router.put('/:id', async (req, res) => {
    const { name, price, description } = req.body;
    await db.query('UPDATE products SET name=?, price=?, description=? WHERE id=?', [name, price, description, req.params.id]);
    res.json({ code: 200, message: '修改成功', data: null });
});

// 删除商品
router.delete('/:id', async (req, res) => {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ code: 200, message: '删除成功', data: null });
});

module.exports = router;