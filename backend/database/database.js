const { Client } = require('pg');

// Setup pgAdmin4 and connect individual
const client = new Client({
    user: process.env.DB_user,
    host: process.env.DB_host,
    database: process.env.DB_name,
    password: process.env.DB_pass,
    port: 24975,
    ssl: {
      rejectUnauthorized: false // hoặc true nếu dịch vụ yêu cầu
    }
});

client.connect();

module.exports = client;