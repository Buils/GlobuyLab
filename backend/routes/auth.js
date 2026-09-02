const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // 1. 检查参数是否为空
    if (!username || !password) {
        return res.status(400).json({ code: 400, message: '账号密码不能为空' });
    }

    try {
        // 2. 查询数据库
        const [rows] = await db.query(
            'SELECT * FROM admins WHERE username = ? AND password = ?', 
            [username, password]
        );

        // 3. 判断结果
        if (rows.length > 0) {
            res.json({ code: 200, message: '登录成功' });
        } else {
            res.status(401).json({ code: 401, message: '账号或密码错误' });
        }
    } catch (error) {
        console.error('登录接口报错:', error);
        res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
});

module.exports = router;