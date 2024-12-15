const CartService = require('../../database/cartService');

class CartController {
    async AddToCart(req, res) {
        try {
            const { product_id, quantity } = req.body
            if (!product_id || !quantity) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            if (!req.params.id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The uid is required',
                    data: null
                })
            }
            req.body.quantity = Number(req.body.quantity)
            const response = await CartService.AddToCart(req.body, req.params.id)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }


    async GetCart(req, res) {
        try {
            const { limit, page, filter, sort } = req.query
            if (!req.params.id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The uid is required',
                    data: null
                })
            }
            const response = await CartService.GetCart(Number(limit) || 5, Number(page) || 0, sort, filter, req.params.id)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    // async GetCartByUserID(req, res, next) {
    //     try {
    //         const {userID}  = req.body;
            
    //     }
    //     catch(err) {
    //         return res.status(404).json({
    //             status: 404,
    //             msg: err,
    //             data: null
    //         })
    //     }
    // }

    async DeleteCart(req, res) {
        try {
            const { product_id } = req.body
            if (!req.params.id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The uid is required',
                    data: null
                })
            }
            if (!product_id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The product_id is required',
                    data: null
                })
            }
            const response = await CartService.DeleteCart(product_id, req.params.id)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async UpdateCart(req, res) {
        try {
            const product_id = req.body
            if (!req.params.id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The uid is required',
                    data: null
                })
            }
            if (!product_id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The product_id is required',
                    data: null
                })
            }
            req.body.quantity = Number(req.body.quantity)
            const response = await CartService.UpdateCart(req.body, req.params.id)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }
}

module.exports = new CartController;