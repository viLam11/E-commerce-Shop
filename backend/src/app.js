const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/index');
const cors = require('cors');
const port = 8000;
const { Pool } = require('pg');

const app  = express();
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Allow all origins (adjust for production)
    methods: 'GET, POST, DELETE, PATCH, OPTIONS', // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers, including Content-Type
}));
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5433,
});

// API lấy dữ liệu
app.get('/api/data', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM product');
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Method', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
  next();
})
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
})