const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.Controller');

router.post('/CreateOrder/:id', orderController.createOrder);
router.get('/getAllOrder/:id', orderController.getAllOrder);
router.get('/getDetailOrder/:id', orderController.getDetailOrder);
router.delete('/DeleteOrder/:id', orderController.deleteOrder);
router.put('/UpdateOrder/:id', orderController.updateOrder);

module.exports = router;