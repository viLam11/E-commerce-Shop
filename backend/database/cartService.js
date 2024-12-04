const client = require('./database')
const image_url = require('./productService')
class CartService {

    async countProducts(categoryName) {
        return new Promise((resolve, reject) => {
            client.query(`SELECT COUNT(*) AS total FROM product WHERE cate_id =$1`, [categoryName], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else {
                    resolve({
                        status: 200,
                        msg: 'COUNT SUCCESS',
                        data: res.rows[0].total
                    });
                }
            });
        });
    }

    async sortProducts(sort, limit, offset, uid) {
        return new Promise((resolve, reject) => {
            const allowedColumns = ['product_id', 'quantity']
            let order = 'ASC';
            let column = 'product_id';

            if (Array.isArray(sort)) {
                const upperSort0 = sort[0].toUpperCase();
                const upperSort1 = sort[1].toUpperCase();

                if (upperSort0 === 'ASC' || upperSort0 === 'DESC') {
                    order = upperSort0;
                    if (allowedColumns.includes(sort[1])) {
                        column = sort[1];
                    }
                } else if (upperSort1 === 'ASC' || upperSort1 === 'DESC') {
                    order = upperSort1;
                    if (allowedColumns.includes(sort[0])) {
                        column = sort[0];
                    }
                }
            } else if (typeof (sort) === "string") {
                if (allowedColumns.includes(sort)) {
                    column = sort;
                }
                else if (sort.toUpperCase() === 'ASC' || sort.toUpperCase() === 'DESC') {
                    order = sort.toUpperCase()
                }
            }
            client.query(
                `SELECT * FROM cart WHERE uid = $1 ORDER BY ${column} ${order} LIMIT $2 OFFSET $3`,
                [uid, limit, offset],
                async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else {
                        for (let i = 0; i < res.rowCount; i++) {
                            const image = await image_url.getImageByProduct(res.rows[i].product_id);
                            if (image.data) res.rows[i].image = image.data.map(item => item.image_url);
                        }
                        resolve({
                            status: 200,
                            msg: 'SORT SUCCESS',
                            data: res.rows
                        });
                    }
                }
            );
        });
    }

    async GetCart(limit, page, sort, filter, uid) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`SELECT * FROM cart WHERE uid = $1`, [uid], async (errCart, resCart) => {
                    if (errCart) {
                        reject({
                            status: 400,
                            msg: errCart.message,
                            data: null
                        });
                    } else if (resCart.rowCount === 0) {
                        reject({
                            status: 404,
                            msg: 'The uid is not exist',
                            data: null
                        });
                    }
                    else {
                        //let countPro = await this.countProducts(resCart.rows[0].cate_id)
                        if (sort) {
                            const products = await this.sortProducts(sort, limit, limit * page, uid)
                            resolve({
                                status: 200,
                                msg: 'SUCCESS',
                                data: products.data,
                                totalProduct: resCart.rowCount,
                                currentPage: page + 1,
                                totalPage: Math.ceil(resCart.rowCount / limit)
                            });
                        }
                        client.query(
                            `SELECT * FROM cart WHERE uid = $1 ORDER BY product_id DESC LIMIT $2 OFFSET $3`,
                            [uid, limit, limit * page],
                            async (errPro, resPro) => {
                                if (errPro) {
                                    reject({
                                        status: 400,
                                        msg: errPro.message,
                                        data: null
                                    });
                                } else {
                                    for (let i = 0; i < resPro.rowCount; i++) {
                                        const image = await image_url.getImageByProduct(resPro.rows[i].product_id);
                                        if (image.data) resPro.rows[i].image = image.data.map(item => item.image_url);
                                    }
                                    resolve({
                                        status: 200,
                                        msg: 'SUCCESS',
                                        data: resPro.rows,
                                        totalProduct: resCart.rowCount,
                                        currentPage: page + 1,
                                        totalPage: Math.ceil(resCart.rowCount / limit)
                                    });
                                }
                            }
                        );
                    }
                })

            }

            catch (err) {
                reject(err)
            }
        })
    }

    async AddToCart(body, uid) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`SELECT * FROM cart WHERE product_id = $1 AND uid = $2`, [body.product_id, uid], async (errCart, resCart) => {
                    if (errCart) {
                        reject({
                            status: 400,
                            msg: errCart.message,
                            data: null
                        });
                    } else if (resCart.rowCount > 0) {// khong biet lieu se nhu vay hay khi tim duoc thi se update nua
                        reject({
                            status: 404,
                            msg: 'The product is exist in cart',
                            data: null
                        });
                    }
                    else {
                        client.query(`INSERT INTO cart(uid, product_id, quantity) VALUES ($1, $2, $3)`, [uid, body.product_id, body.quantity], (err, res) => {
                            if (err) {
                                reject({
                                    status: 400,
                                    msg: err.message,
                                    data: null
                                });
                            } else {
                                resolve({
                                    status: 200,
                                    msg: 'Add to cart success',
                                    data: res.rows[0]
                                });
                            }
                        })

                    }
                })

            }

            catch (err) {
                reject(err)
            }
        })
    }

    async UpdateCart(body, uid) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
                    SELECT * FROM cart
                    WHERE uid = $1 AND product_id = $2
                `, [uid, body.product_id], async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    }
                    else if (res.rows.length === 0) {
                        resolve({
                            status: 404,
                            msg: 'The product_id is not exist',
                            data: null
                        });
                    }
                    else {
                        try {
                            await client.query(
                                `UPDATE cart SET quantity = $1 WHERE uid = $2 AND product_id = $3`,
                                [body.quantity, uid, body.product_id]
                            );
                            const updateuser = await client.query(`SELECT * FROM cart WHERE uid = $1 AND product_id = $2`, [uid, body.product_id])
                            resolve({
                                status: 200,
                                msg: 'Update success',
                                data: updateuser.rows[0]
                            });
                        } catch (updateErr) {
                            reject({
                                status: 400,
                                msg: updateErr.message,
                                data: null
                            });
                        }
                    }
                })

            }

            catch (err) {
                reject(err)
            }
        })
    }

    async DeleteCart(product_id, uid) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
                    SELECT * FROM cart
                    WHERE uid = $1 AND product_id = $2
                `, [uid, product_id], async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    }
                    else if (res.rows.length === 0) {
                        resolve({
                            status: 404,
                            msg: 'The product_id is not exist',
                            data: null
                        });
                    }
                    else {
                        try {
                            await client.query(`DELETE FROM cart WHERE product_id = $1 AND uid = $2 RETURNING *`, [product_id, uid]);
                            resolve({
                                status: 200,
                                msg: 'delete product in cart success',
                                data: null
                            });
                        } catch (deleteErr) {
                            reject({
                                status: 400,
                                msg: deleteErr.message,
                                data: null
                            });
                        }
                    }
                })
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = new CartService;