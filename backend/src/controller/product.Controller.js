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
            // let file = (req.file) ? req.file : req.files;
            // req.body.image = file
            console.log(req.body)
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
            const productId = req.params.id;
            console.log("CHECK PRODID: ", productId);
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
            // let file = (req.file) ? req.file : req.files;
            const {ismain, image} = req.body;
            const product_id = req.params.id
            console.log(ismain, image, product_id);
            if (!product_id || ismain < 0 || !image || image.length <= 0) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            console.log("đã qua");
            const response = await ProductService.addImage(product_id, req.body);
            //let response = null;
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
            const response = await ProductService.deleteImage(productID, imageURL);
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
            // let body = req.body;
            const {product_id}  = req.query;
            console.log(req.body, req.query);
            // body chứa file, image_url, ismain
            // có những trường hợp nào xảy ra khi điều chỉnh hình ảnh
            /*
            - có tác động lên ảnh:
                + vài ảnh dạng như ấn dấu x trên ảnh thì sẽ xoá riêng ảnh đó thôi
                + toàn bộ
                + chỉ sửa ismain (có gửi kèm immage_url và không gừi kèm file)
            - không tác động lên ảnh => ko làm gì
            */
            if (!product_id) {
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

    async CreateReview(req, res) {
        try {
            const product_id = req.params.id;
            if (!product_id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.CreateReview(product_id, req.body);
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

    async UpdateReview(req, res) {
        try {
            const product_id = req.params.id;
            if (!product_id) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.UpdateReview(product_id, req.body);
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

    async DeleteReview(req, res) {
        try {
            const {product_id, uid} = req.query;
            if (!product_id || !uid) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.DeleteReview(req.query);
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

    async GetReview(req, res) {
        try {
            const {product_id, page, limit} = req.query;
            console.log(product_id, page, limit)
            if (!product_id || !page || !limit) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await ProductService.GetReview(req.query);
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