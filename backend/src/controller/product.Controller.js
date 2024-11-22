const ProductService = require('../../database/productService');

class ProductController {
    async createProduct(req, res) {
        try {
            const { pname, price, brand, description, quantity, cate_id } = req.body
            if (!pname || !price || !brand || !description || !quantity || !cate_id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.createProduct(req.body)
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

    async updateProduct(req, res) {
        try {
            const productId = req.params.id
            const data = req.body
            console.log(productId);
            if (!productId) {
                return res.status(400).json({
                    status: 400,
                    message: 'The productID is required',
                    data: null
                })
            }
            const response = await ProductService.updateProduct(productId, data)
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

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id
            if (!productId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The productID is required',
                    data: null
                })
            }
            const response = await ProductService.deleteProduct(productId)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                mstatus: 404,
                msg: err,
                data: null
            })
        }
    }

    async deleteMany(req, res) {
        try {
            const ids = req.body.id
            console.log(typeof (ids))
            if (!ids) {
                return res.status(400).json({
                    status: 'ERR',
                    msg: 'The ids is required',
                    data: null
                })
            }
            const response = await ProductService.deleteMany(ids)
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

    async getDetailProduct(req, res) {
        try {
            const productId = req.params.id
            if (!productId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The productID is required'
                })
            }
            const response = await ProductService.getDetailProduct(productId)
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

    async getAllProduct(req, res) {
        try {
            const { limit, page, filter, sort } = req.query
            const response = await ProductService.getAllProduct(Number(limit) || 5, Number(page) || 0, filter, sort)
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

    //Image

    async addImage(req, res) {
        try {
            const image = req.body
            const productId = req.params.id
            if (!image || !productId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.addImage(productId, req.body);
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

    async getImageByProduct(req, res) {
        try {
            const productId = req.params.id
            if (!productId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The productID is required'
                })
            }
            const response = await ProductService.getImageByProduct(productId);
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

    async deleteImage(req, res) {
        try {
            const imageURL = req.query.image_url;
            const productID = req.query.product_id;
            if (!imageURL || !productID) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.deleteImage(productID ,imageURL);
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                mstatus: 404,
                msg: err,
                data: null
            })
        }
    }

    async deleteImageByProduct(req, res) {
        try {
            const productID = req.params.id
            if (!productID) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The imageID is required',
                    data: null
                })
            }
            const response = await ProductService.deleteImageByProduct(productID);
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                mstatus: 404,
                msg: err,
                data: null
            })
        }
    }

    async updateImage(req, res) {
        try {
            const imageURL = req.query.image_url;
            const productID = req.query.product_id;
            if (!imageURL || !productID) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.updateImage(req.query, req.body);
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                mstatus: 404,
                msg: err,
                data: null
            })
        }
    }
}

module.exports = new ProductController;