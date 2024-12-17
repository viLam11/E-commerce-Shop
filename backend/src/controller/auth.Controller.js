//const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserService = require('../../database/userService');

class AuthController {
    async postSignUp(req, res) {
        // console.log('CHECK authData: ', req.body)
        //const userId = uuidv4();
        const { email, password, confirmPassword } = req.body;
        let username = req.body.username;
        if (!username) {
            username = email.split('@')[0];
        }

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 400,
                msg: "The input is required"
            })
        }
        else if (!isCheckEmail) {
            return res.status(400).json({
                status: 400,
                msg: "The Email is not correct"
            })
        }
        else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 400,
                msg: "The confirmPassword is not correct"
            })
        }

        const checkUser = await UserService.findByEmail(email)
        if (checkUser.data !== null) {
            return res.status(409).json({
                status: 409,
                msg: "The email is already used"
            });
        }
        try {
            const hashPw = await bcrypt.hash(password, 12);
            let result;
            if (req.body.userType === 'admin') {
                result = await UserService.createAdmin(username, hashPw, req.body);
            } else {
                result = await UserService.createCustomer(username, hashPw, req.body);
            }
            return res.status(200).json(result);
        } catch (err) {
            if (!err.status) {
                res.status(500).json({
                    status: 500,
                    msg: err.message,
                    data: null
                });
            } else {
                res.status(err.status).json({
                    status: err.status,
                    msg: err.msg,
                    data: err.data
                });
            }
        }
        // bcrypt.hash(password, 12)
        //     .then((hashPw) => {
        //         if (req.body.userType === 'admin') {
        //             UserService.createAdmin(username, hashPw, req.body);
        //         }
        //         else {
        //             UserService.createCustomer(username, hashPw, req.body);
        //         }
        //     })
        //     .then(result => {
        //         res.status(200).json({
        //             status: 200,
        //             msg: 'User created',
        //             data: null
        //             //userId: userId
        //         })
        //     })
        //     .catch(err => {
        //         if (!err.statusCode) {
        //             err.statusCode = 500;
        //         }
        //         next(err);
        //     })}catch(errCreate){
        //         res.status(err.statusCode || 500).json({
        //             status: "ERR",
        //             message: err.message || "An error occurred"
        //         });
        //     }
    }


    //thiếu kiểm soát phiên đăng nhập khi một tk đăng nhập, có thể đăng nhập tk đó ở mấy khác nên phải kiểm soát bằng cách thêm token vào db hoặc tìm hiểu về redis
    async postLogin(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        let loadedUser;
        UserService.findByEmail(email)
            .then(result => {
                if (result.status !== 200) {
                    const error = new Error('Wrong email');
                    error.statusCode = 401;
                    error.msg = result.msg;
                    error.data = null;
                    throw error;

                }

                loadedUser = result.data[0];
                console.log('Check user: ', loadedUser);
                return bcrypt.compare(password, loadedUser.upassword);
            })
            .then((isEqual) => {
                if (!isEqual) {
                    const error = new Error('Wrong password');
                    error.statusCode = 401;
                    error.msg = 'Wrong password';
                    error.data = null;
                    throw error;
                }

                const token = jwt.sign(
                    {
                        userId: loadedUser.uid,
                        userType: loadedUser.usertype,
                        email: loadedUser.email,
                    },
                    process.env.SECRET_TOKEN,
                    { expiresIn: '1h' }
                );

                //localStorage.setItem('token', token);
                // res.cookie('token', token, {
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV === 'production', // Chỉ bật secure trên môi trường production
                //     maxAge: 3600000 // 1 giờ
                // });

                res.status(200).json({
                    status: 200,
                    msg: 'Authentication successful',
                    data: { token: token, userType: loadedUser.usertype}
                });
            })
            .catch(err => {
                res.status(err.statusCode || 500).json({
                    status: err.statusCode || 500,
                    msg: err.msg || 'An error occurred',
                    data: err.data || null
                });
            });
    }

    async fetchAllUsers(req, res) {
        try {
            const { limit, page, filter, sort } = req.query
            const response = await UserService.fetchUsers(Number(limit) || 5, Number(page) || 0, filter, sort)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
        // const limit = req.params.limit ? req.params.limit : null;
        // try {
        //     const data = await UserService.fetchUsers(limit);
        //     res.json(data);
        // }
        // catch (err) {
        //     next(err);
        // }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id
            const data = req.body
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.updateUser(userId, data)
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

    async deleteUser(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.deleteUser(userId)
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

    async getDetailUser(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.getDetailUser(userId)
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
    async logout(req, res) {
        // const token = req.cookies.token;
        // if (!token) {
        //     return res.status(401).json({
        //         status: 401,
        //         msg: 'No active session found',
        //         data: null
        //     });
        // }
        // res.clearCookie('token'); // Xóa cookie chứa token
        return res.status(200).json({
            status: 200,
            msg: 'Logged out successfully',
            data: null
        });
    }

    async createPhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.createPhone(user_id, body);
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

    async updatePhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.updatePhone(user_id, body);
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

    async deletePhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.deletePhone(user_id, body);
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

    async getPhone(req, res) {
        try {
            const body = req.body;
            const user_id = req.params.id

            if (!(body && user_id)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.getPhone(user_id);
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

    async createAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            if (!req.body) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.createAddress(userId, req.body)
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

    async updateAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            if (!req.body) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await UserService.updateAddress(userId, req.body)
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

    async deleteAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.deleteAddress(userId, req.body)
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

    async getAllAddress(req, res) {
        try {
            const userId = req.params.id
            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The userID is required',
                    data: null
                })
            }
            const response = await UserService.getAllAddress(userId)
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

    async getAddressById(req, res, next) {
        try {
            const userId = req.params.id;
            if(!userId) {
                return res.status(400).json({
                    status: 400,
                    msg: "The userID is required",
                    data: null
                })
            }
            
            
        } catch(err) {
            return res.status(400).json({
                status: 400,
                msg: err,
                data: null
            })
        }
    }
}

module.exports = new AuthController;