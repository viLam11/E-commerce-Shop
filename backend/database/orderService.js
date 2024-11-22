const client = require('./database');
const { v4: uuidv4 } = require('uuid')

class OrderService {
    constructor() { };

    async updateProductStock(productId, amount) {
        return new Promise((resolve, reject) => {
            // Kiểm tra xem số lượng tồn kho có đủ không
            client.query(
                `SELECT quantity FROM product WHERE product_id = $1`,
                [productId],
                (err, res) => {
                    if (err) {
                        return reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    }

                    const currentQuantity = res.rows[0].quantity;

                    // Nếu số lượng tồn kho không đủ
                    if (currentQuantity < amount) {
                        return reject({
                            status: 400,
                            msg: 'Not enough stock',
                            data: null
                        });
                    }

                    // Nếu đủ số lượng, tiến hành cập nhật (thiếu
                    //         , selled = selled + $1)
                    client.query(
                        `UPDATE product 
                         SET quantity = quantity - $1
                         WHERE product_id = $2
                         RETURNING *`,
                        [amount, productId],
                        (err, res) => {
                            if (err) {
                                reject({
                                    status: 400,
                                    msg: err.message,
                                    data: null
                                });
                            } else {
                                resolve({
                                    status: 200,
                                    msg: 'Update successful',
                                    data: res.rows[0]
                                });
                            }
                        }
                    );
                }
            );
        });
    }

    async createOrder(newOrder) {
        return new Promise(async (resolve, reject) => {
            const { orderItems, uid, status, shipping_address, shipping_fee, shipping_co } = newOrder
            const orderId = uuidv4();
            await client.query('BEGIN');
            try {
                let totalQuantity = 0;
                let totalPrice = 0;
                await new Promise((resolveOrder, rejectOrder) => {
                    client.query(
                        `INSERT INTO orders( oid, uid, status, shipping_address, shipping_fee, shipping_co, quantity, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [orderId, uid, status, shipping_address, shipping_fee, shipping_co, totalQuantity, totalPrice],
                        async (err, res) => {
                            if (err) {
                                console.log(err)
                                rejectOrder({
                                    status: 400,
                                    msg: err.message,
                                    data: null
                                })
                            } else {
                                resolveOrder({
                                    status: 200,
                                    msg: "Create successfully!",
                                })
                            }
                        }
                    )
                })
                const promises = orderItems.map(async (order) => {
                    const productData = await this.updateProductStock(order.product, order.amount)
                    console.log('productData', productData)
                    if (productData) {
                        totalQuantity += order.amount;
                        totalPrice += productData.data.price * order.amount;
                        await new Promise((resolveInclude, rejectInclude) => {
                            client.query(
                                `INSERT INTO order_include (order_id, product_id, quantity, paid_price) VALUES ($1, $2, $3, $4)`,
                                [orderId, order.product, order.amount, productData.data.price],
                                (err) => {
                                    if (err) {
                                        //console.log(err);
                                        return rejectInclude({
                                            status: 400,
                                            msg: err.message,
                                            id: null
                                        });
                                    } else {
                                        //console.log("check")
                                        return resolveInclude({
                                            status: 200,
                                            msg: 'Product added to order_include',
                                        });
                                    }
                                }
                            );
                        })

                    } else {
                        return ({
                            status: 'OK',
                            msg: 'ERR',
                            id: order.product
                        })
                    }
                })
                const results = await Promise.all(promises)
                totalPrice += shipping_fee
                // console.log('totalQuantity', totalQuantity)
                // console.log('totalPrice', totalPrice)
                const newData = results && results.filter((item) => (item && item.id))
                if (newData.length) {
                    await client.query('ROLLBACK');
                    resolve({
                        status: 'ERR',
                        msg: `San pham voi id ${newData.join(',')} khong du hang`
                    })
                }
                await new Promise((resolveOrder, rejectOrder) => {
                    client.query(
                        `UPDATE orders SET quantity = $2, price = $3 WHERE oid = $1`,
                        [orderId, totalQuantity, totalPrice],
                        async (err, res) => {
                            if (err) {
                                console.log(err)
                                await client.query('ROLLBACK');
                                rejectOrder({
                                    status: 400,
                                    msg: err.message,
                                    data: null
                                })
                            } else {
                                await client.query('COMMIT');
                                resolveOrder({
                                    status: 200,
                                    msg: "Create successfully!",
                                })
                            }
                        }
                    )
                })
                resolve({
                    status: 200,
                    msg: 'SUCCESS',
                });
            } catch (err) {
                console.log(err.message)
                await client.query('ROLLBACK');
                reject({
                    status: 400,
                    msg: err.message
                })
            }
        })
    }

    async confirmPayment(orderId) {
        return new Promise((resolve, reject) => {
            client.query(
                `UPDATE orders SET status = 'Paid' WHERE oid = $1 RETURNING *`,
                [orderId],
                (err, res) => {
                    if (err || res.rowCount === 0) {
                        reject({ status: 400, msg: 'Payment confirmation failed' });
                    } else {
                        resolve({ status: 200, msg: 'Payment confirmed' });
                    }
                }
            );
        });
    }
    async findsomethingExist(column, value) {
        return new Promise((resolve, reject) => {
            client.query(`
                SELECT * FROM order
                WHERE ${column} = $1
            `, [value], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                }
                else {
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: res
                    })
                }
            })
        })
    }

    async updateOrder(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID
                try {
                    checkID = await this.findsomethingExist("order_id", id)
                }
                catch (errfindID) {
                    reject({
                        status: 400,
                        msg: errfindID.msg,
                        data: null
                    });
                }
                if (checkID.data.rows.length === 0) {
                    resolve({
                        status: 404,
                        msg: `The order_id is not exist`,
                        data: null
                    });
                } else {
                    let checkPname
                    try {
                        checkPname = await this.findsomethingExist("Pname", data.Pname)
                    }
                    catch (errfindPname) {
                        reject({
                            status: 400,
                            msg: errfindPname.msg,
                            data: null
                        });
                    }
                    if (checkPname.data.rows.length !== 0 && checkPname.data.rows[0].order_id !== id) {
                        resolve({
                            status: 404,
                            msg: 'The Pname is already exist',
                            data: null
                        });
                    }
                    else {
                        try {
                            for (const [key, value] of Object.entries(data)) {
                                await client.query(
                                    `UPDATE order SET ${key} = $1 WHERE order_id = $2`,
                                    [value, id]
                                );
                            }
                            const updateorder = await client.query(`SELECT * FROM order WHERE order_id = $1`, [id])

                            resolve({
                                status: 200,
                                msg: 'Update success',
                                data: updateorder.rows[0]
                            });
                        } catch (updateErr) {
                            reject({
                                status: 400,
                                msg: updateErr.message,
                                data: null
                            });
                        }
                    }
                }
            }
            catch (err) {
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        })
    }

    async deleteOrder(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID
                try {
                    checkID = await this.findsomethingExist("order_id", id)
                }
                catch (errfindID) {
                    reject({
                        status: 400,
                        msg: errfindID.msg,
                        data: null
                    });
                }
                if (checkID.data.rows.length === 0) {
                    resolve({
                        status: 404,
                        msg: `The order_id is not exist`,
                        data: null
                    });
                } else {
                    client.query(`
                        DELETE FROM order WHERE order_id = $1
                    `, [id], (deleteErr, deleteRes) => {
                        if (deleteErr) {
                            reject({
                                status: 400,
                                msg: deleteErr.message,
                                data: null
                            });
                        } else {
                            resolve({
                                status: 200,
                                msg: "Order deleted successfully",
                                data: null
                            });
                        }
                    });
                }
            }
            catch (err) {
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        });
    };

    async deleteMany(ids) {
        return new Promise(async (resolve, reject) => {
            try {
                const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");

                // Câu truy vấn xóa nhiều bản ghi với các `id` cụ thể
                const queryText = `DELETE FROM order WHERE order_id IN (${placeholders})`;

                // Thực hiện truy vấn với các `id` được truyền vào
                const res = await client.query(queryText, ids);

                resolve({
                    status: 'OK',
                    message: 'Delete success',
                    rowsDeleted: res.rowCount
                })

            }
            catch (err) {
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        });
    };

    async getDetailOrder(id) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
                SELECT * FROM order
                WHERE order_id = $1
            `, [id], async (err, res) => {
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
                            msg: 'The order is not exist',
                            data: null
                        });
                    }
                    else {
                        resolve({
                            status: 200,
                            msg: 'SUCCESS',
                            data: res.rows[0]
                        });
                    }
                })
            }
            catch (err) {
                reject(err)
            }
        })
    }


    async countOrders() {
        return new Promise((resolve, reject) => {
            client.query(`SELECT COUNT(*) AS total FROM order`, (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else {
                    resolve(res.rows[0].total);
                }
            });
        });
    }


    async sortOrders(sort, limit, offset) {
        return new Promise((resolve, reject) => {
            const allowedColumns = ['order_id', 'Pname', 'price', 'brand', 'quantity', 'cate_id', 'last_updated_time']
            if (sort === undefined) {
                sort = ['ASC', 'order_id']
            }
            else if (typeof (sort) === "string") {
                if (allowedColumns.includes(sort)) {
                    sort = ['ASC', sort]
                } else {
                    sort = [(sort.toUpperCase() === 'DESC') ? 'DESC' : 'ASC', 'order_id']
                }
            }
            else {
                sort[0] = (sort[0] === 'DESC' || sort[0].toUpperCase() === 'DESC') ? sort[0].toUpperCase() : 'ASC'
                sort[1] = allowedColumns.includes(sort[1]) ? sort[1] : 'order_id'
            }
            client.query(
                `SELECT * FROM order ORDER BY ${sort[1]} ${sort[0]} LIMIT $1 OFFSET $2`,
                [limit, offset],
                (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else {
                        resolve(res.rows);
                    }
                }
            );
        });
    }

    async filterOrders(filter) {// chỉ tìm được chuỗi liền kề
        return new Promise((resolve, reject) => {
            client.query(`SELECT * FROM order WHERE ${filter[0]} ILIKE $1`, [`%${filter[1]}%`], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else {
                    resolve(res);
                }
            });
        });
    }

    async filterOrders1(filter) { //của chatgpt giúp tìm kí tự bất kì có trong chuỗi
        return new Promise((resolve, reject) => {
            const searchChars = filter[1].split('');
            const likeConditions = searchChars.map(char => `${filter[0]} ILIKE '%${char}%'`).join(' AND ');
            const query = `SELECT * FROM order WHERE ${likeConditions}`;

            client.query(query, (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else {
                    resolve(res);
                }
            });
        });
    }

    async getAllOrder(limit, page, filter, sort) {
        return new Promise(async (resolve, reject) => {
            try {
                let countPro = await this.countOrders()
                if (filter) {
                    const orderFilter = await this.filterOrders1(filter)
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: orderFilter.rows,
                        totalOrder: orderFilter.rowCount,
                        currentPage: page + 1,
                        totalPage: Math.ceil(orderFilter.rowCount / limit)
                    });
                }
                if (sort) {
                    const orders = await this.sortOrders(sort, limit, limit * page)
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: orders,
                        totalOrder: countPro,
                        currentPage: page + 1,
                        totalPage: Math.ceil(countPro / limit)
                    });
                }
                client.query(
                    `SELECT * FROM order LIMIT $1 OFFSET $2`,
                    [limit, limit * page],
                    (err, res) => {
                        if (err) {
                            reject({
                                status: 400,
                                msg: err.message,
                                data: null
                            });
                        } else {
                            resolve({
                                status: 200,
                                msg: 'SUCCESS',
                                data: res.rows,
                                totalOrder: countPro,
                                currentPage: page + 1,
                                totalPage: Math.ceil(countPro / limit)
                            });
                        }
                    }
                );
            }

            catch (err) {
                reject(err)
            }
        })
    }
}



module.exports = new OrderService;