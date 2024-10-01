const {validationResult } = require('express-validator');
const {v4 : uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserService = require('../../database/userSerive');

class AuthController {
    postSignUp(req, res, next){
        // console.log('CHECK authData: ', req.body)
        const userId = uuidv4();
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed');
            error.statusCode = 422;
            error.data = errors.array();
            console.log(error);
            throw error;
        }
        const {email, password} = req.body;
        let username = req.body.username;
        if(!username) {
            username = email.split('@')[0];
        }
        bcrypt.hash(password, 12)
            .then((hashPw) => {
                return UserService.createUser(username, hashPw, email);
            })
            .then(result => {
                res.status(200).json({
                    msg: 'User created',
                    userId: userId
                })
            })
            .catch(err => {
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    }

    async postLogin(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        let loadedUser;
        UserService.findByEmail(email) 
            .then(result => {
                if(result.status !== 200) {
                    const error = new Error('Wrong email');
                    error.statusCode = 401;
                    throw err;
                }

                loadedUser = result.data[0];
                console.log('Check user: ', loadedUser);   
                return bcrypt.compare(password, loadedUser.password);
            })
            .then((isEqual) => {
                if(!isEqual) {
                    const error = new Error('Wrong password');
                    error.statusCode = 401;
                    throw error;
                }

                const token = jwt.sign(
                    {
                        email: loadedUser.email, 
                        userId: loadedUser.id
                    },
                    process.env.SECRET_TOKEN,
                    { expiresIn: '1h'}
                );
                res.status(200).json({
                    token: token,
                })
            })
            .catch(err => {
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    }

    async fetchAllUsers(req, res, next) {
        const limit = req.params.limit ? req.params.limit : null;
        try {
            const data = await UserService.fetchUsers(limit);
            res.json(data);
        }
        catch(err) {
            next(err);
        }
    }
}

module.exports = new AuthController;