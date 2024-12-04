const OrderService = require('../../database/orderService');

class OrderController {
    // create type deli_state as enum('Cancelled','Completed','Returned','Shipped','Pending','Paid');
    // create table orders(
    //     oid						varchar(100) 	primary key,
    //     uid						varchar(100) 	not null ,
    //     status					deli_state	 	not null,
    //     create_time				date	 	 	default now(),
    //     done_time				date	 	 	default now(),
    //     shipping_address		varchar(100) 	not null,
    //     shipping_fee			integer		 	default 0,
    //     estimated_delivery_time	date			default now(),
    //     receive_time			date	 		default now(),
    //     shipping_co				varchar(50) 	not null,
    //     quantity				integer			not null,
    //     total_price					integer			not null,
    //     final_price				integer			not null,
    //     constraint fk_order_prod foreign key(uid)
    //                 references users(uid)
    // );

    async createOrder(req, res) {
        try {
            const { orderItems, status, shipping_address, shipping_fee, shipping_co, quantity, total_price, final_price } = req.body
            if (!orderItems || !status || !shipping_address || !shipping_fee || !shipping_co || !quantity || !total_price || !final_price) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            }
            const response = await OrderService.createOrder(req.body, req.params.id)
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
            if (!orderId) {
                return res.status(400).json({
                    status: 'ERR',
                    msg: 'The orderID is required',
                    data: null
                })
            }
            if (!req.body) {
                return res.status(400).json({
                    status: 'ERR',
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await OrderService.updateOrder(orderId, req.body)
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

    // async deleteMany(req, res) {
    //     try {
    //         const ids = req.body.id
    //         if (!ids) {
    //             return res.status(400).json({
    //                 status: 'ERR',
    //                 msg: 'The ids is required',
    //                 data: null
    //             })
    //         }
    //         const response = await OrderService.deleteMany(ids)
    //         return res.status(200).json(response)
    //     }
    //     catch (err) {
    //         return res.status(404).json({
    //             msg: err
    //         })
    //     }
    // }


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
            if (!req.params.id) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The uid is required'
                })
            }
            const response = await OrderService.getAllOrder(Number(limit) || 5, Number(page) || 0, filter, sort, req.params.id)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                msg: err
            })
        }
    }
}

module.exports = new OrderController;