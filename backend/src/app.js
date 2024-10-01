const express = require('express');
const bodyParder = require('body-parser');
const route = require('./routes/index');
const cors = require('cors');
const port = 8000;

const app  = express();
// app.use(bodyParder.urlencoded());
app.use(bodyParder.json());
app.use(cors({
    origin: '*', // Allow all origins (adjust for production)
    methods: 'GET, POST, DELETE, PATCH, OPTIONS', // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers, including Content-Type
}));
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