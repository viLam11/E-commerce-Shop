const { Client } = require('pg');

// Setup pgAdmin4 and connect individual
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5433,
});

client.connect();

module.exports = client;