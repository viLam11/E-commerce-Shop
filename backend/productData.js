const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());


// Cấu hình kết nối PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5433,
});

// API lấy dữ liệu
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/product', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM product');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/image', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM image');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/category', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM category');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reviews');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
