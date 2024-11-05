const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const productController = require('../controller/product.Controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/CreateProduct', authMiddleware.authUserMiddleWare, productController.createProduct);
router.put('/UpdateProduct/:id', authMiddleware.authUserMiddleWare, productController.updateProduct);
router.delete('/DeleteProduct/:id', authMiddleware.authUserMiddleWare, productController.deleteProduct);
router.get('/get-detail/:id', productController.getDetailProduct);
router.get('/getAll', authMiddleware.authUserMiddleWare, productController.getAllProduct);
router.delete('/delete-many', authMiddleware.authUserMiddleWare, productController.deleteMany);


module.exports = router;