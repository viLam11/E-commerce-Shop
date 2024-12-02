const { Client } = require('pg');

// Setup pgAdmin4 and connect individual
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'HTTT',
    password: '02032004',
    port: 5432,
});

client.connect();

module.exports = client;