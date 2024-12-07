const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart.Controller');
//const authMiddleware = require('../middleware/authMiddleware.js');
//const authOrder = require('../controller/order.Controller.js');

router.post('/AddToCart/:id', cartController.AddToCart);
router.get('/GetCart/:id', cartController.GetCart);
router.delete('/DeleteCart/:id', cartController.DeleteCart);
router.put('/UpdateCart/:id', cartController.UpdateCart);

module.exports = router;