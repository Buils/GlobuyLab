const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 数据

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const ordersRouter = require('./routes/orders');
app.use('/api/orders', ordersRouter);

const feedbacksRouter = require('./routes/feedbacks');
app.use('/api/feedbacks', feedbacksRouter);

const categoriesRouter = require('./routes/categories');
app.use('/api/categories', categoriesRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// 测试接口：检查后端是否跑通
app.get('/api/test', (req, res) => {
    res.json({
        code: 200,
        message: 'GlobuyLab 后端服务启动成功！',
        data: null
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(` 后端服务已启动: http://localhost:${PORT}`);
});