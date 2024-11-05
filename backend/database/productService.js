const client = require('./database');
const { v4: uuidv4 } = require('uuid')

class ProductService {
    constructor() { };

    async createProduct(newProduct) {
        return new Promise((resolve, reject) => {
            const { pname, price, brand, description, quantity, cate_id } = newProduct
            client.query(`
                SELECT * FROM product
                WHERE pname = $1
            `, [pname], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                }
                else if (res.rows.length !== 0) {
                    resolve({
                        status: 404,
                        msg: 'The product is already exist',
                        data: null
                    });
                }
                else {
                    try {
                        const productId = uuidv4();
                        client.query(
                            `INSERT INTO product( product_id, pname, price, brand, description, quantity, cate_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                            [productId, pname, price, brand, description, quantity, cate_id],
                            (err, res) => {
                                if (err) {
                                    console.log(err)
                                    reject({
                                        status: 400,
                                        msg: err.message,
                                        data: null
                                    })
                                } else {
                                    resolve({
                                        status: 200,
                                        msg: "Create successfully!",
                                        data: newProduct
                                    })
                                }
                            }
                        )
                        client.end;
                    }
                    catch (e) {
                        reject(e)
                    }
                }
            })
        })
    }

    async findsomethingExist(column, value) {
        return new Promise((resolve, reject) => {
            client.query(`
                SELECT * FROM product
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

    async updateProduct(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID
                try {
                    checkID = await this.findsomethingExist("product_id", id)
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
                        msg: `The product_id is not exist`,
                        data: null
                    });
                } else {
                    let checkpname
                    try {
                        checkpname = await this.findsomethingExist("pname", data.pname)
                    }
                    catch (errfindpname) {
                        reject({
                            status: 400,
                            msg: errfindpname.msg,
                            data: null
                        });
                    }
                    if (checkpname.data.rows.length !== 0 && checkpname.data.rows[0].product_id !== id) {
                        resolve({
                            status: 404,
                            msg: 'The pname is already exist',
                            data: null
                        });
                    }
                    else {
                        try {
                            for (const [key, value] of Object.entries(data)) {
                                await client.query(
                                    `UPDATE product SET ${key} = $1 WHERE product_id = $2`,
                                    [value, id]
                                );
                            }
                            const updateproduct = await client.query(`SELECT * FROM product WHERE product_id = $1`, [id])

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

    async deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID
                try {
                    checkID = await this.findsomethingExist("product_id", id)
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
                        msg: `The product_id is not exist`,
                        data: null
                    });
                } else {
                    client.query(`
                        DELETE FROM product WHERE product_id = $1
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
                                msg: "Product deleted successfully",
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
                const queryText = `DELETE FROM product WHERE product_id IN (${placeholders})`;

                // Thực hiện truy vấn với các `id` được truyền vào
                const res = await client.query(queryText, ids);

                resolve({
                    status: 200,
                    msg: 'Delete success',
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

    async getDetailProduct(id) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
                SELECT * FROM product
                WHERE product_id = $1
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
                            msg: 'The product is not exist',
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


    async countProducts() {
        return new Promise((resolve, reject) => {
            client.query(`SELECT COUNT(*) AS total FROM product`, (err, res) => {
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


    async sortProducts(sort, limit, offset) {
        return new Promise((resolve, reject) => {
            const allowedColumns = ['product_id', 'pname', 'price', 'brand', 'quantity', 'cate_id', 'create_time', 'rating', 'sold']
            if (sort === undefined) {
                sort = ['ASC', 'product_id']
            }
            else if (typeof (sort) === "string") {
                if (allowedColumns.includes(sort)) {
                    sort = ['ASC', sort]
                } else {
                    sort = [(sort.toUpperCase() === 'DESC') ? 'DESC' : 'ASC', 'product_id']
                }
            }
            else {
                sort[0] = (sort[0] === 'DESC' || sort[0].toUpperCase() === 'DESC') ? sort[0].toUpperCase() : 'ASC'
                sort[1] = allowedColumns.includes(sort[1]) ? sort[1] : 'product_id'
            }
            client.query(
                `SELECT * FROM product ORDER BY ${sort[1]} ${sort[0]} LIMIT $1 OFFSET $2`,
                [limit, offset],
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
                            msg: 'SORT SUCCESS',
                            data: res.rows
                        });
                    }
                }
            );
        });
    }

    // async filterProducts(filter) {// chỉ tìm được chuỗi liền kề
    //     return new Promise((resolve, reject) => {
    //         client.query(`SELECT * FROM product WHERE ${filter[0]} ILIKE $1`, [`%${filter[1]}%`], (err, res) => {
    //             if (err) {
    //                 reject({
    //                     status: 400,
    //                     msg: err.message,
    //                     data: null
    //                 });
    //             } else {
    //                 resolve(res);
    //             }
    //         });
    //     });
    // }

    // async filterProducts1(filter) { //của chatgpt giúp tìm kí tự bất kì có trong chuỗi
    //     return new Promise((resolve, reject) => {
    //         const searchChars = filter[1].split('');
    //         const likeConditions = searchChars.map(char => `${filter[0]} ILIKE '%${char}%'`).join(' AND ');
    //         const query = `SELECT * FROM product WHERE ${likeConditions}`;

    //         client.query(query, (err, res) => {
    //             if (err) {
    //                 reject({
    //                     status: 400,
    //                     msg: err.message,
    //                     data: null
    //                 });
    //             } else {
    //                 resolve(res);
    //             }
    //         });
    //     });
    // }

    async filterProduct(filter, limit, offset) { //của chatgpt giúp tìm kí tự bất kì có trong chuỗi
        return new Promise(async (resolve, reject) => {
            const columns = ['pname', 'brand', 'description'];
            filter = filter.split('')
            const likeConditions = columns.map(column => {
                const conditions = filter.map(char => `${column} ILIKE '%${char}%'`).join(' AND ');
                return `(${conditions})`;
            }).join(' OR ');

            const query = `SELECT * FROM product WHERE ${likeConditions} LIMIT $1 OFFSET $2`
            const countQuery = `SELECT COUNT(*) AS total FROM product WHERE ${likeConditions}`
            const count = await new Promise((resolve, reject) => {
                client.query(countQuery, (err, countRes) => {
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
                            data: countRes.rows[0].total
                        });
                    }
                })
            })
            client.query(query, [limit, offset], (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null,
                        countData: 0
                    });
                } else {
                    resolve({
                        status: 200,
                        msg: 'FILTER SUCCESS',
                        data: res,
                        countData: count.data
                    });
                }
            });
        });
    }

    async getAllProduct(limit, page, filter, sort) {
        return new Promise(async (resolve, reject) => {
            try {
                let countPro = await this.countProducts()
                if (filter) {
                    const productFilter = await this.filterProduct(filter, limit, limit * page)
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: productFilter.data.rows,
                        totalProduct: productFilter.countData,
                        currentPage: page + 1,
                        totalPage: Math.ceil(productFilter.countData / limit)
                    });
                }
                if (sort) {
                    const products = await this.sortProducts(sort, limit, limit * page)
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: products,
                        totalProduct: countPro.data,
                        currentPage: page + 1,
                        totalPage: Math.ceil(countPro.data / limit)
                    });
                }
                client.query(
                    `SELECT * FROM product LIMIT $1 OFFSET $2`,
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
                                totalProduct: countPro.data,
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



module.exports = new ProductService;