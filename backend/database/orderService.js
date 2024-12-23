const client = require('./database');
const CreateID = require('../createID')

class OrderService {
    constructor() { };

/** OLD */
    // async updateProductStock(productId, amount) {
    //     return new Promise((resolve, reject) => {
    //         // Kiểm tra xem số lượng tồn kho có đủ không
    //         try {
    //             client.query(
    //                 `SELECT quantity FROM product WHERE product_id = $1`,
    //                 [productId],
    //                 (err, res) => {
    //                     if (err) {
    //                         return reject({
    //                             status: 400,
    //                             msg: err.message,
    //                             data: null
    //                         });
    //                     }

    //                     console.log("prodID: ", productId);
    //                     console.log("Check response: ", res.rows[0].quantity);
    //                     console.log("amount: ", amount);

    //                     const currentQuantity = res.rows[0].quantity;
    //                     // const currentQuantity = 10;
    //                     // Nếu số lượng tồn kho không đủ
    //                     if (currentQuantity < amount) {

    //                         console.log('Not enough stock');
    //                         return reject({
    //                             status: 400,
    //                             msg: 'Not enough stock',
    //                             data: null
    //                         });
    //                     }

    //                     // Nếu đủ số lượng, tiến hành cập nhật (thiếu
    //                     //         , selled = selled + $1)
    //                     client.query(
    //                         `UPDATE product 
    //                         SET quantity = quantity - $1,
    //                             sold = sold + $1
    //                         WHERE product_id = $2
    //                         RETURNING *`,
    //                         [amount, productId],
    //                         (err, res) => {
    //                             if (err) {
    //                                 reject({
    //                                     status: 400,
    //                                     msg: err.message,
    //                                     data: null
    //                                 });
    //                             } else {
    //                                 resolve({
    //                                     status: 200,
    //                                     msg: 'Update successful',
    //                                     data: res.rows[0]
    //                                 });
    //                             }
    //                         }
    //                     );
    //                 }
    //             );
    //         }
    //         catch (err) {
    //             reject({
    //                 status: 400,
    //                 msg: err.message
    //             })
    //         }
    //     });
    // }
/**NEW */

async updateProductStock(productId, amount) {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem số lượng tồn kho có đủ không
        try {
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

                    console.log("prodID: ", productId);
                    console.log("Check response: ", res.rows[0].quantity);
                    console.log("amount: ", amount);

                    const currentQuantity = res.rows[0].quantity;
                    // const currentQuantity = 10;
                    // Nếu số lượng tồn kho không đủ
                    if (currentQuantity < amount) {

                        console.log('Not enough stock');
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
                        SET quantity = quantity - $1,
                            sold = sold + $1
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
        }
        catch (err) {
            reject({
                status: 400,
                msg: err.message
            })
        }
    });
}


    // async createOrder(newOrder, uid) {
    //     return new Promise(async (resolve, reject) => {
    //         const { orderItems, status, shipping_address, shipping_fee, shipping_co, quantity, total_price, promotion_id } = newOrder
    //         const orderId = CreateID.generateID("order");
    //         await client.query('BEGIN');
    //         try {
    //             await client.query(
    //                 `INSERT INTO orders( oid, uid, status, shipping_address, shipping_fee, shipping_co, quantity, total_price, final_price)
    //                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    //                 [orderId, uid, status, shipping_address, shipping_fee, shipping_co, quantity, total_price, shipping_fee + total_price]);
    //             if (promotion_id) {
    //                 await client.query(`UPDATE promotion SET quantity = quantity-1 WHERE promotion_id = $1`, [promotion_id])
    //             }
    //             let iid = 0
    //             const errorProducts = [];
    //             for (const order of orderItems) {
    //                 try {
    //                     // Kiểm tra và cập nhật số lượng sản phẩm
    //                     const productData = await this.updateProductStock(order.product_id, order.quantity);
    //                     iid += 1;

    //                     // Thêm sản phẩm vào bảng order_include
    //                     await client.query(
    //                         `INSERT INTO order_include (iid, oid, product_id, quantity, paid_price, cate_id, promotion_id)
    //                      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    //                         [iid, orderId, order.product_id, order.quantity, order.subtotal, productData.data.cate_id, promotion_id]
    //                     );
    //                 } catch (err) {
    //                     console.log(err);
    //                     errorProducts.push(order.product_id); // Lưu sản phẩm không đủ số lượng
    //                 }
    //             }

    //             // Nếu có sản phẩm lỗi, rollback và trả về thông báo
    //             if (errorProducts.length > 0) {
    //                 await client.query('ROLLBACK');

    //                 console.log("HERE !!! ", errorProducts);
    //                 return resolve({
    //                     status: 'ERR',
    //                     msg: `Sản phẩm với id ${errorProducts.join(', ')} không đủ hàng`
    //                 });
    //             }
    //             await client.query('COMMIT');
    //             resolve({
    //                 status: 200,
    //                 msg: 'SUCCESS',
    //             });
    //         } catch (err) {
    //             await client.query('ROLLBACK');
    //             reject({
    //                 status: 400,
    //                 msg: err.message
    //             })
    //         }
    //     })
    // }


    async findsomethingExist(table, column, value) {
        return new Promise((resolve, reject) => {
            client.query(`
                SELECT * FROM ${table}
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

    async updateOrder(orderId, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID
                try {
                    checkID = await this.findsomethingExist("orders", "oid", orderId)
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
                        msg: `The oid is not exist`,
                        data: null
                    });
                } else {
                    try {
                        for (const [key, value] of Object.entries(data)) {
                            if (key === "oid") continue;
                            await client.query(
                                `UPDATE orders SET ${key} = $1 WHERE oid = $2`,
                                [value, orderId]
                            );
                        }
                        await client.query(`UPDATE orders SET final_price = total_price + shipping_fee WHERE oid = $1`, [orderId]);
                        const updateproduct = await client.query(`SELECT * FROM orders WHERE oid = $1`, [orderId])

                        resolve({
                            status: 200,
                            msg: 'Update success',
                            data: updateproduct.rows[0]
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
            catch (err) {
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        })
    }

    async deleteOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID
                try {
                    checkID = await this.findsomethingExist("orders", "oid", orderId)
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
                    try {
                        await client.query(`DELETE FROM orders WHERE oid = $1`, [orderId]);
                        await client.query(`DELETE FROM order_include WHERE oid = $1`, [orderId]);
                        resolve({
                            status: 200,
                            msg: "Order deleted successfully",
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

    async getDetailOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
                SELECT * FROM orders
                WHERE oid = $1
            `, [orderId], async (err, res) => {
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
                        try {
                            //const resOrder = await client.query(`SELECT * FROM order_include WHERE oid = $1`, [orderId])
                            const resOrder = await client.query(`SELECT 
                                                                    oi.*, 
                                                                    p.*
                                                                FROM order_include oi
                                                                LEFT JOIN product p ON oi.product_id = p.product_id
                                                                WHERE oi.oid = $1`, [orderId])
                            resolve({
                                status: 200,
                                msg: 'SUCCESS',
                                data: resOrder.rows
                            });
                        }
                        catch (errOrder) {
                            reject({
                                status: 400,
                                msg: errOrder.message,
                                data: null
                            });
                        }
                    }
                })
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


    async countOrders(uid) {
        return new Promise((resolve, reject) => {
            client.query(`SELECT COUNT(*) AS total FROM orders WHERE uid = $1`, [uid], (err, res) => {
                if (err) {
                    console.log(typeof (uid))
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                } else {
                    resolve({
                        status: 200,
                        data: res.rows[0].total
                    });
                }
            });
        });
    }

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

    async sortOrders(sort, limit, offset, uid) {
        return new Promise((resolve, reject) => {
            const allowedColumns = ['oid', 'create_time', 'status', 'done_time', 'shipping_address', 'shipping_fee', 'shipping_co', 'quantity', 'total_price', 'final_price', 'estimated_delivery_time', 'receive_time']
            let order = 'DESC';
            let column = 'create_time';

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
                `SELECT * FROM orders  WHERE uid = $3 ORDER BY ${column} ${order} LIMIT $1 OFFSET $2`,
                [limit, offset, uid],
                async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else {
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

    async getAllOrder(limit, page, filter, sort, uid) {
        return new Promise(async (resolve, reject) => {
            try {
                let countPro = await this.countOrders(uid)
                if (sort) {
                    const orders = await this.sortOrders(sort, limit, limit * page, uid)
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: orders.data,
                        totalOrder: countPro.data,
                        currentPage: page + 1,
                        totalPage: Math.ceil(countPro.data / limit)
                    });
                }
                client.query(
                    `SELECT * FROM orders WHERE uid = $3 LIMIT $1 OFFSET $2`,
                    [limit, limit * page, uid],
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
                                totalPage: Math.ceil(countPro.data / limit)
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