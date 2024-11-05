const PromotionService  = require('../../database/promotionService');

class PromotionController {
    async createPromotion(req, res, next){
        try{
            const {pro_name, quantity, description, starttime, endtime, minspent, fix_value, percentage, max_amount, discount_type, apply_range} = req.body
            if (!(pro_name && quantity && description && starttime && endtime && minspent && fix_value && percentage && max_amount && discount_type && apply_range)) {
                return res.status(200).json({
                    status: 'ERR',
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await PromotionService.createPromotion(req.body)
            return res.status(200).json(response)
        }
        catch(err){
            return res.status(404).json({
                status: 'ERR',
                msg: err,
                data: null
            })
        }
    }

    async updatePromotion(req, res, next) {
        try {
            const promotionId = req.params.id
            const data = req.body
            if (!promotionId) {
                return res.status(200).json({
                    status: 'ERR',
                    msg: 'The promotionID is required'
                })
            }
            const response = await PromotionService.updatePromotion(promotionId, data)
            return res.status(200).json(response)
        }
        catch (e) {
            next(e);
        }
    }
    
    async deletePromotion(req, res, next) {
        try {
            const promotionId = req.params.id
            if (!promotionId) {
                return res.status(400).json({
                    status: 'ERR',
                    msg: 'The promotionID is required',
                    data: null
                })
            }
            const response = await PromotionService.deletePromotion(promotionId)
            return res.status(200).json(response)
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    }
}

module.exports = new PromotionController;