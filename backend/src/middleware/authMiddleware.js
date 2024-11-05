
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthMiddleWare {
    // async authMiddleWare(req, res, next) {
    //     const token = req.headers.token.split(' ')[1]
    //     jwt.verify(token, process.env.SECRET_TOKEN, function (err, user) {
    //         if (err) {
    //             return res.status(404).json({
    //                 status: 404,
    //                 msg: 'the authentication',
    //                 data: null
    //             })
    //         }
    //         const userType = user.userType
    //         if (userType === 'admin') {
    //             next()
    //         } else {
    //             return res.status(404).json({
    //                 status: 404,
    //                 msg: 'The authentication',
    //                 data: null
    //             })
    //         }
    //     });
    // }

    async authUserMiddleWare(req, res, next) {
        //const token = req.headers.token.split(' ')[1]
        const token = req.headers.authorization.split(' ')[1]
        const userid = req.params.id
        jwt.verify(token, process.env.SECRET_TOKEN, function (err, user) {
            if (err) {
                return res.status(404).json({
                    status: 404,
                    msg: 'the authentication',
                    data: null
                })
            }
            if (user.userType === 'admin' || user.userId === userid) {
                next()
            } else {
                return res.status(404).json({
                    status: 404,
                    msg: 'The authentication',
                    data: null
                })
            }
        });
    }
}

module.exports = new AuthMiddleWare;