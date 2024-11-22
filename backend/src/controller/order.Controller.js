const OrderService = require('../../database/orderService');

class OrderController {
    async createOrder(req, res) {
        try {
            const { uid, status, shipping_address, shipping_fee, shipping_co } = req.body
            if (!uid || !status || !shipping_address || !shipping_fee || !shipping_co) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            }
            const response = await OrderService.createOrder(req.body)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                message: err
            })
        }
    }

    async confirmPayment(req, res) {
        try {
            const orderId = req.params.id
            if (!orderId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The orderId is required'
                })
            }
            const response = await OrderService.confirmPayment(orderId)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                message: err
            })
        }
    }

    async updateOrder(req, res) {
        try {
            const orderId = req.params.id
            const data = req.body
            if (!orderId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The orderID is required'
                })
            }
            const response = await OrderService.updateOrder(orderId, data)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                msg: err
            })
        }
    }

    async deleteOrder(req, res) {
        try {
            const orderId = req.params.id
            if (!orderId) {
                return res.status(400).json({
                    status: 'ERR',
                    msg: 'The orderID is required',
                    data: null
                })
            }
            const response = await OrderService.deleteOrder(orderId)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                msg: err
            })
        }
    }

    async deleteMany(req, res) {
        try {
            const ids = req.body.id
            if (!ids) {
                return res.status(400).json({
                    status: 'ERR',
                    msg: 'The ids is required',
                    data: null
                })
            }
            const response = await OrderService.deleteMany(ids)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                msg: err
            })
        }
    }


    async getDetailOrder(req, res) {
        try {
            const orderId = req.params.id
            if (!orderId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The orderID is required'
                })
            }
            const response = await OrderService.getDetailOrder(orderId)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                msg: err
            })
        }
    }


    async getAllOrder(req, res) {
        try {
            const { limit, page, filter, sort } = req.query
            const response = await OrderService.getAllOrder(Number(limit) || 5, Number(page) || 0, filter, sort)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                msg: err
            })
        }
    }

    // async userCart(req, res){
    //     const{cart}=req.body;
    //     const{_id} = req.user;
    //     const user = 
    // }
}

module.exports = new OrderController;