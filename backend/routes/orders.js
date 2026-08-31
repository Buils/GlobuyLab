const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 创建订单接口
router.post('/', async (req, res) => {
    const { items, address } = req.body; // 前端传来的购物车商品和地址
    
    // 1. 计算总金额
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
        // 2. 开启数据库事务（保证订单和订单详情要么一起成功，要么一起失败）
        const connection = await db.getConnection();
        await connection.beginTransaction();

        // 3. 插入订单主表
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_name, total_amount, address) VALUES (?, ?, ?)',
            ['模拟用户', totalAmount, address]
        );
        const orderId = orderResult.insertId;

        // 4. 批量插入订单详情表
        const itemValues = items.map(item => [orderId, item.name, item.price, item.quantity]);
        await connection.query(
            'INSERT INTO order_items (order_id, product_name, price, quantity) VALUES ?',
            [itemValues]
        );

        // 5. 提交事务
        await connection.commit();
        connection.release();

        res.json({ code: 200, message: '订单创建成功', data: { orderId } });
    } catch (error) {
        res.status(500).json({ code: 500, message: '订单创建失败', data: null });
    }
});

module.exports = router;