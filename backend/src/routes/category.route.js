const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.Controller');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/getOneCategory', authMiddleware.authMiddleWare, authMiddleware.authProductMiddleWare, categoryController.getOneCategory);
router.get('/getAll', categoryController.getAllCategory);


module.exports = router;