const express = require('express');
const router = express.Router();
//const {body, param} = require('express-validator');
const promotionController = require('../controller/promotion.Controller');

router.post('/CreatePromotion', promotionController.createPromotion);
router.put('/UpdatePromotion/:id', promotionController.updatePromotion);
router.delete('/DeletePromotion/:id', promotionController.deletePromotion);
router.get('/GetPromotion/:id', promotionController.getPromotion);
router.get('/GetAll', promotionController.getAll);

module.exports = router;