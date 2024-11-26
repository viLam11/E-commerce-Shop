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

router.post('/logout', authController.logout);
router.get('/users', authController.fetchAllUsers);


router.put('/update-user/:id', authController.updateUser);

router.delete('/delete-user/:id', authController.deleteUser);

router.get('/get-detail/:id', authController.getDetailUser);


router.post('/CreateAddress/:id', authController.createAddress);
router.get('/GetAll/:id', authController.getAllAddress);
router.delete('/DeleteAddress/:id', authController.deleteAddress);
router.put('/UpdateAddress/:id', authController.updateAddress);



router.post('/CreatePhone/:id', authController.createPhone);
router.put('/UpdatePhone/:id', authController.updatePhone);
router.delete('/DeletePhone/:id', authController.deletePhone);
router.get('/GetPhone/:id', authController.getPhone); //tất cả số điện thoại của người dùng






//router.put('/confirmPayment/:id', authOrder.confirmPayment);

//router.post('/cart', authController.userCart);

// router.get('/', (req, res, next) => {
//     res.status(200).send('Hello World');
// });


module.exports = router;