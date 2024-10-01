const express = require('express');
const router = express.Router();
const UserService = require('../../database/userService');

router.post('/signUp', authController.postSignUp);


router.post('/login', authController.postLogin);

router.get('/users', isAuth, authController.fetchAllUsers);

router.get('/', (req, res, next) => {
    res.status(200).send('This is auth route');
});

module.exports = router;