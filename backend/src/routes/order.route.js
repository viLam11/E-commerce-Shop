const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const orderController = require('../controller/order.Controller');

router.post('/create', orderController.createOrder);


module.exports = router;