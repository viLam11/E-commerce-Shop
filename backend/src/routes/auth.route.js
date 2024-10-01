const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.Controller');
const UserService = require('../../database/userService');

router.post('/signUp', authController.postSignUp);

router.post('/login', authController.postLogin);

router.get('/users', authController.fetchAllUsers);

router.get('/', (req, res, next) => {
    res.status(200).send('Hello World');
});

module.exports = router;