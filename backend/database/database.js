const { Client } = require('pg');

// Setup pgAdmin4 and connect individual
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: process.env.DB_name,
    password: process.env.DB_pass,
    port: 5433,
});

client.connect();

module.exports = client;    