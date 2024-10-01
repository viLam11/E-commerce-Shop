const express = require('express');
const route = express.Router();
const UserService = require('../../database/userService');

express.get('/users', async (req, res, next) => { 

})

route.get('/', (req, res, next) => {
    res.status(200).json({
        "title": "Book",
        "content": "Welcome to..."
    })
});

module.exports = route;