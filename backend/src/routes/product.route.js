const express = require('express');
const router = express.Router();
//const { body, param } = require('express-validator');
const productController = require('../controller/product.Controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/CreateProduct', authMiddleware.authUserMiddleWare, productController.createProduct);
router.put('/UpdateProduct/:id',authMiddleware.authUserMiddleWare, productController.updateProduct);
router.delete('/DeleteProduct/:id',authMiddleware.authUserMiddleWare, productController.deleteProduct);
router.get('/get-detail/:id', productController.getDetailProduct);
router.get('/getAll', productController.getAllProduct);
router.delete('/delete-many',authMiddleware.authUserMiddleWare, productController.deleteMany);

//image
router.post('/AddImage/:id',authMiddleware.authUserMiddleWare, productController.addImage);
router.get('/GetImageByProduct/:id',authMiddleware.authUserMiddleWare, productController.getImageByProduct);
router.delete('/DeleteImage',authMiddleware.authUserMiddleWare, productController.deleteImage);
router.delete('/DeleteImageByProduct/:id',authMiddleware.authUserMiddleWare, productController.deleteImageByProduct);
router.put('/UpdateImage',authMiddleware.authUserMiddleWare, productController.updateImage);

module.exports = router;