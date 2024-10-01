const { Client } = require('pg');

// Setup pgAdmin4 and connect individual
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: '',  // cap nhat ca nhan
    password: '', // cap nhat ca nhan
    port: 5432,
});

client.connect();

module.exports = client;