const express = require('express');
const router = express.Router();
//const { body, param } = require('express-validator');
const productController = require('../controller/product.Controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/CreateProduct', authMiddleware.authMiddleWare, authMiddleware.authProductMiddleWare, productController.createProduct);
router.put('/UpdateProduct/:id', authMiddleware.authMiddleWare, authMiddleware.authProductMiddleWare, productController.updateProduct);
router.delete('/DeleteProduct/:id', authMiddleware.authMiddleWare, authMiddleware.authProductMiddleWare, productController.deleteProduct);
router.get('/get-detail/:id', authMiddleware.authMiddleWare, authMiddleware.authProductMiddleWare, productController.getDetailProduct);
router.get('/getAll', authMiddleware.authMiddleWare, authMiddleware.authProductMiddleWare, productController.getAllProduct);
router.delete('/delete-many', authMiddleware.authMiddleWare, authMiddleware.authProductMiddleWare, productController.deleteMany);

//image
router.post('/AddImage/:id', productController.addImage);
router.get('/GetImageByProduct/:id', productController.getImageByProduct);
router.delete('/DeleteImage/:id', productController.deleteImage);
router.delete('/DeleteImageByProduct/:id', productController.deleteImageByProduct);
router.put('/UpdateImage/:id', productController.updateImage);

module.exports = router;