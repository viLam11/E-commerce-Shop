const sql = require('mssql');

// Setup pgAdmin4 and connect individual
const config = {
    user: 'cyberClone', // Tên đăng nhập (Login name)
    password: '123456', // Mật khẩu bạn đã thiết lập
    server: 'VoltaZen-1404', // Tên máy chủ hoặc IP của SQL Server
    database: 'e_commerce', // Tên database mặc định (master theo hình)
    options: {
        encrypt: false, // Đặt true nếu bạn sử dụng Azure SQL hoặc chứng chỉ SSL
        trustServerCertificate: true, // Hỗ trợ chứng chỉ tự ký
    },
    port: 1433, // Cổng mặc định của SQL Server
};

const client = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        throw err;
    });
module.exports = {sql, client};