const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',       
    user: 'root',            
    password: 'abc123456',     
    database: 'globuylab_db'
});

module.exports = pool.promise(); 