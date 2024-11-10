const express = require('express');
const router = express.Router();
const {body, param} = require('express-validator');
const authController = require('../controller/auth.Controller');
const UserService = require('../../database/userService');
router.post('/signUp',[
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({min: 5})
        .withMessage('Password mus be  at leat 5 characters long')
]  ,authController.postSignUp);

router.post('/login',[
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({min: 5})
        .withMessage('Password mus be  at leat 5 characters long')
] , authController.postLogin);

router.get('/users', authController.fetchAllUsers); 

router.get('/', (req, res, next) => {
    res.status(200).json({ message: "Your response message here" });
});


module.exports = router;