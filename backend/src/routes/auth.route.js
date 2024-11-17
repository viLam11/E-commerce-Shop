const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authController = require('../controller/auth.Controller');
const authMiddleware = require('../middleware/authMiddleware.js');
//const authOrder = require('../controller/order.Controller.js');


router.post('/signUp', [
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password mus be  at leat 5 characters long')
], authController.postSignUp);

router.post('/login', [
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password mus be  at leat 5 characters long')
], authController.postLogin);

<<<<<<< HEAD
router.get('/users', authController.fetchAllUsers);
=======
//router.post('/logout', authController.logout);
router.get('/users', authController.fetchAllUsers);


router.put('/update-user/:id', authController.updateUser);

router.delete('/delete-user/:id', authMiddleware.authUserMiddleWare, authController.deleteUser);

router.get('/get-detail/:id', authController.getDetailUser);

//router.put('/confirmPayment/:id', authOrder.confirmPayment);

//router.post('/cart', authController.userCart);
>>>>>>> BE2

// router.get('/', (req, res, next) => {
//     res.status(200).send('Hello World');
// });


module.exports = router;