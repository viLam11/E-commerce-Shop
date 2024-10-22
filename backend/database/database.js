const { Client } = require('pg');

// Setup pgAdmin4 and connect individual
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DoAn_DB',
    password: 'nkt3012',
    port: 5432,
});

client.connect();

module.exports = client;