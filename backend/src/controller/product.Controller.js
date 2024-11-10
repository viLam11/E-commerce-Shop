const {v4 : uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const AdminService  = require('../../database/adminService');

class manageProductController{
    async fetchAllProducts(req, res, next) {
        const limit = req.params.limit ? req.params.limit : null;
        try {
            const data = await AdminService.fetchProduct(limit);
            res.json(data);
        }
        catch(err) {
            next(err);
        }
    }
}

module.exports = new manageProductController;