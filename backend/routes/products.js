const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取商品列表（支持搜索和分类筛选）
router.get('/', async (req, res) => {
    const { keyword, categoryId } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (keyword) {
        sql += ' AND name LIKE ?';
        params.push(`%${keyword}%`);
    }
    if (categoryId) {
        sql += ' AND category_id = ?';
        params.push(categoryId);
    }

    try {
        const [rows] = await db.query(sql, params);
        res.json({ code: 200, message: '获取商品列表成功', data: rows });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
    }
});

// 新增商品
router.post('/', async (req, res) => {
    const { name, price, description, category_id } = req.body;
    try {
        const [result] = await db.query('INSERT INTO products (name, price, description, category_id) VALUES (?, ?, ?, ?)', [name, price, description, category_id]);
        res.json({ code: 200, message: '添加成功', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ code: 500, message: '添加失败', data: null });
    }
});

// 修改商品
router.put('/:id', async (req, res) => {
    const { name, price, description, category_id } = req.body;
    try {
        await db.query('UPDATE products SET name=?, price=?, description=?, category_id=? WHERE id=?', [name, price, description, category_id, req.params.id]);
        res.json({ code: 200, message: '修改成功', data: null });
    } catch (error) {
        res.status(500).json({ code: 500, message: '修改失败', data: null });
    }
});

// 删除商品
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
        res.json({ code: 200, message: '删除成功', data: null });
    } catch (error) {
        res.status(500).json({ code: 500, message: '删除失败', data: null });
    }
});

module.exports = router;