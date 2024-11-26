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

router.post('/CreateProduct', upload.array('image', 6), productController.createProduct);
router.put('/UpdateProduct/:id', productController.updateProduct);
router.delete('/DeleteProduct/:id', productController.deleteProduct);
router.get('/get-detail/:id', productController.getDetailProduct);
router.get('/getAll', productController.getAllProduct);
router.delete('/delete-many', productController.deleteMany);

router.post('/AddImage/:id', upload.array('image', 6), productController.addImage);
router.get('/GetImageByProduct/:id', productController.getImageByProduct);
router.delete('/DeleteImage', productController.deleteImage);
router.delete('/DeleteImageByProduct/:id', productController.deleteImageByProduct);
router.put('/UpdateImage/:id', upload.array('image', 6), productController.updateImage);


router.post('/CreateReview/:id', productController.CreateReview);
router.put('/UpdateReview/:id', productController.UpdateReview);
router.delete('/DeleteReview/:id', productController.DeleteReview);
router.get('/GetReview/:id', productController.GetReview);

module.exports = router;