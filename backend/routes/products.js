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

// 根据 ID 获取单个商品详情
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        
        // 如果查不到商品，返回 404 提示
        if (rows.length === 0) {
            return res.status(404).json({ code: 404, message: '商品不存在', data: null });
        }
        
        res.json({ code: 200, message: '获取商品详情成功', data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
    }
});

// 新增商品接口
router.post('/', async (req, res) => {
    const { name, price, original_price, spec, description, image_url, category_id, is_on_sale } = req.body;
    
    if (!name || price === undefined) {
        return res.status(400).json({ code: 400, message: '商品名和价格不能为空' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO products (name, price, original_price, spec, description, image_url, category_id, is_on_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, price, original_price || 0, spec || '', description || '', image_url || '', category_id || 1, is_on_sale !== undefined ? is_on_sale : 1]
        );
        res.json({ code: 200, message: '商品添加成功', data: { id: result.insertId } });
    } catch (error) {
        console.error('新增商品报错:', error);
        res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
});

// 批量导入分类
router.post('/import-categories', async (req, res) => {
    const { categories } = req.body; // 期望格式: [{ name: '数码电子' }, ...]
    if (!categories || categories.length === 0) {
        return res.status(400).json({ code: 400, message: '分类数据不能为空' });
    }
    try {
        const values = categories.map(c => [c.name]);
        const [result] = await db.query('INSERT INTO categories (name) VALUES ?', [values]);
        res.json({ code: 200, message: `成功导入 ${result.affectedRows} 个分类` });
    } catch (error) {
        console.error('导入分类报错:', error);
        res.status(500).json({ code: 500, message: '导入分类失败' });
    }
});

// 批量导入商品（支持通过分类名称自动匹配ID）
router.post('/import-products', async (req, res) => {
    const { products } = req.body;
    if (!products || products.length === 0) {
        return res.status(400).json({ code: 400, message: '商品数据不能为空' });
    }

    try {
        // 1. 先查出所有的分类，建立一个 "名称 -> ID" 的映射字典，避免循环查库
        const [categories] = await db.query('SELECT id, name FROM categories');
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat.id;
        });

        // 2. 遍历商品数据，将分类名称转换为真实的 ID
        const values = products.map(p => {
            const categoryId = categoryMap[p.category_name] || 1; // 如果找不到对应分类，默认归入 ID=1 的分类
            return [
                p.name, 
                p.price, 
                p.original_price, 
                p.spec, 
                p.description, 
                p.image_url, 
                categoryId, 
                p.is_on_sale
            ];
        });

        // 3. 批量插入商品表
        const [result] = await db.query(
            'INSERT INTO products (name, price, original_price, spec, description, image_url, category_id, is_on_sale) VALUES ?', 
            [values]
        );
        res.json({ code: 200, message: `成功导入 ${result.affectedRows} 个商品` });
    } catch (error) {
        console.error('导入商品报错:', error);
        res.status(500).json({ code: 500, message: '导入商品失败' });
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