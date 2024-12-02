const express = require('express');
const router = express.Router();
//const { body, param } = require('express-validator');
const productController = require('../controller/product.Controller');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image/'); // Lưu vào thư mục 'image'
    },
    filename: (req, file, cb) => {
        cb(null, performance.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/CreateProduct', authMiddleware.authUserMiddleWare, upload.array('image', 6), productController.createProduct);
router.put('/UpdateProduct/:id', authMiddleware.authUserMiddleWare, productController.updateProduct);
router.delete('/DeleteProduct/:id', authMiddleware.authUserMiddleWare, productController.deleteProduct);
router.get('/get-detail/:id', productController.getDetailProduct);
router.get('/getAll', productController.getAllProduct);
router.delete('/delete-many', authMiddleware.authUserMiddleWare, productController.deleteMany);

//image
router.post('/AddImage/:id', authMiddleware.authUserMiddleWare, upload.array('image', 6), productController.addImage);
router.get('/GetImageByProduct/:id', productController.getImageByProduct);
router.delete('/DeleteImage', authMiddleware.authUserMiddleWare, productController.deleteImage);
router.delete('/DeleteImageByProduct/:id', authMiddleware.authUserMiddleWare, productController.deleteImageByProduct);
router.put('/UpdateImage/:id', authMiddleware.authUserMiddleWare, upload.array('image', 6), productController.updateImage);


router.post('/CreateReview/:id', productController.CreateReview);
router.put('/UpdateReview/:id', productController.UpdateReview);
router.delete('/DeleteReview/:id', productController.DeleteReview);
router.get('/GetReview/:id', productController.GetReview);

module.exports = router;
