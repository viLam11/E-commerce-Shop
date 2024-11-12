const express = require('express');
const router = express.Router();
//const { body, param } = require('express-validator');
const productController = require('../controller/product.Controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/CreateProduct', productController.createProduct);
router.put('/UpdateProduct/:id', productController.updateProduct);
router.delete('/DeleteProduct/:id', productController.deleteProduct);
router.get('/get-detail/:id', productController.getDetailProduct);
router.get('/getAll', productController.getAllProduct);
router.delete('/delete-many', productController.deleteMany);

//image
router.post('/AddImage/:id', productController.addImage);
router.get('/GetImageByProduct/:id', productController.getImageByProduct);
router.delete('/DeleteImage', productController.deleteImage);
router.delete('/DeleteImageByProduct/:id', productController.deleteImageByProduct);
router.put('/UpdateImage', productController.updateImage);

module.exports = router;