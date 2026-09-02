const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    const { items, user_name, phone, email, address } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ code: 400, message: '购物车不能为空' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        // 插入订单主表
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_name, phone, email, total_amount, address) VALUES (?, ?, ?, ?, ?)',
            [user_name, phone, email, totalAmount, address]
        );
        const orderId = orderResult.insertId;

        // 批量插入订单详情表
        const itemValues = items.map(item => [orderId, item.name, item.price, item.quantity]);
        await connection.query(
            'INSERT INTO order_items (order_id, product_name, price, quantity) VALUES ?',
            [itemValues]
        );

        await connection.commit();
        connection.release();

        // 生成简易 Token
        const token = Buffer.from(`user_${orderId}_${Date.now()}`).toString('base64');
        res.json({ code: 200, message: '订单创建成功', data: { orderId, token } });
    } catch (error) {
        console.error('订单创建失败:', error); // 👈 加上这行，看后端控制台报什么错
        res.status(500).json({ code: 500, message: '订单创建失败', data: null });
    }
});

module.exports = router;