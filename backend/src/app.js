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
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
})