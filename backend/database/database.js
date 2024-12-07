const { Client } = require('pg');

// Setup pgAdmin4 and connect individual
const client = new Client({
    user: "avnadmin",
    host: "postgresql-asmcnpm.e.aivencloud.com",
    database: "DATH-Ecommerce",
    password: "AVNS_qWYAfB6LzEKIWsqgq6i",
    port: 24975,
    ssl: {
      rejectUnauthorized: false // hoặc true nếu dịch vụ yêu cầu
    }
});

client.connect();

module.exports = client;