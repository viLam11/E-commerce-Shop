const client = require('./database');
const CreateID = require('../createID')
//const path = require('path');
const fs = require('fs');
const { CallTracker } = require('assert');
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
                        const productId = CreateID.generateID('product');
                        client.query(
                            `INSERT INTO product( product_id, pname, price, brand, description, quantity, cate_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                            [productId, pname, price, brand, description, quantity, cate_id],
                            async (err, res) => {
                                if (err) {
                                    reject({
                                        status: 400,
                                        msg: err.message,
                                        data: null
                                    })
                                } else {
                                    let obj = {};
                                    if ("image" in newProduct) {
                                        obj = { image: newProduct.image };
                                        if ("ismain" in newProduct) obj.ismain = newProduct.ismain;
                                        else obj.ismain = 0
                                        try {
                                            await this.addImage(productId, obj);  // ensure this is an async function
                                        } catch (error) {
                                            reject({
                                                status: 400,
                                                msg: "Error adding image",
                                                data: null
                                            });
                                            return;
                                        }
                                    }
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
                    reject(errfindID.msg);
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
                                if (key === "product_id" || key === "ismain") continue;
                                if (key === "image"){
                                    let img_res = await this.updateImage({product_id: id}, data)
                                    console.log(img_res)
                                } else{
                                    await client.query(
                                        `UPDATE product SET ${key} = $1 WHERE product_id = $2`,
                                        [value, id]
                                    );
                                }
                            }
                            const updateproduct = await client.query(`
                                SELECT p.*, ARRAY_AGG(i.image_url) AS image
                                FROM product p
                                JOIN image i ON p.product_id = i.product_id
                                WHERE p.product_id = $1
                                GROUP BY 
                                    p.product_id, p.pname, p.brand, p.description, p.price, 
                                    p.quantity, p.create_time, p.cate_id, p.sold, p.rating;
                                `, [id]);

                            resolve({
                                status: 200,
                                msg: 'Update success',
                                data: updateproduct.rows[0]
                            });
                        } catch (updateErr) {
                            reject(updateErr.message);
                        }
                    }
                }
            }
            catch (err) {
                reject(err.message);
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
                    await this.deleteImageByProduct(id);
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
                        const image = await this.getImageByProduct(id);
                        console.log(image)
                        res.rows[0].image = image.data.map(item => item.image_url);
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
                `SELECT * FROM product ORDER BY ${column} ${order} LIMIT $1 OFFSET $2`,
                [limit, offset],
                async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else {
                        for (let i = 0; i < res.rowCount; i++) {
                            const image = await this.getImageByProduct(res.rows[i].product_id);
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

    // cần filter kiểu theo 1 string
    async filterProduct(filter, limit, offset) { //của chatgpt giúp tìm kí tự bất kì có trong chuỗi
        return new Promise(async (resolve, reject) => {
            const columns = ['pname', 'brand', 'description'];
            // filter = filter.split('')
            // const likeConditions = columns.map(column => {
            //     const conditions = filter.map(char => `${column} ILIKE '%${char}%'`).join(' AND ');
            //     return `(${conditions})`;
            // }).join(' OR ');
            const keywords = filter.split(' ');

            // Tạo điều kiện LIKE với từng từ trên từng cột
            const likeConditions = columns.map(column => {
                // Với mỗi cột, tạo điều kiện OR cho các từ khóa
                const conditions = keywords.map(word => `${column} ILIKE '%${word}%'`).join(' OR ');
                return `(${conditions})`;
            }).join(' OR '); // Kết hợp các điều kiện cột bằng OR

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
            client.query(query, [limit, offset], async (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null,
                        countData: 0
                    });
                } else {
                    for (let i = 0; i < res.rowCount; i++) {
                        const image = await this.getImageByProduct(res.rows[i].product_id);
                        if (image.data) res.rows[i].image = image.data.map(item => item.image_url);
                    }
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
                        data: products.data,
                        totalProduct: countPro.data,
                        currentPage: page + 1,
                        totalPage: Math.ceil(countPro.data / limit)
                    });
                }
                client.query(
                    `SELECT * FROM product ORDER BY create_time DESC LIMIT $1 OFFSET $2`,
                    [limit, limit * page], async (err, res) => {
                        if (err) {
                            reject({
                                status: 400,
                                msg: err.message,
                                data: null
                            });
                        } else {
                            for (let i = 0; i < res.rowCount; i++) {
                                const image = await this.getImageByProduct(res.rows[i].product_id);
                                if (image.data) res.rows[i].image = image.data.map(item => item.image_url);
                            }
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

    async findsomethingExistImage(column, value) {
        return new Promise((resolve, reject) => {
            client.query(`
                SELECT * FROM image
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

    async addImage(productId, body) {
        try {
            // const images = file.map(obj => obj.path)
            const {image, ismain} = body
            // const isArray = Array.isArray(image);

            // Check if product exists
            const checkProduct = await this.findsomethingExist("product_id", productId);
            if (checkProduct.data.rows.length === 0) {
                return {
                    status: 404,
                    msg: `The product_id does not exist`,
                    data: null
                };
            }

            // Add images to the product
            for (let i = 0; i < image.length; i++) {
                let imageUrl = image[i] // Handle case when images is not an array

                // Check if image already exists
                const checkImage = await client.query(`
                    SELECT * FROM image 
                    WHERE product_id = $1 AND image_url = $2
                `, [productId, imageUrl]);
                if (checkImage.rows.length !== 0) {
                    console.log(`Image URL ${imageUrl} already exists for product ${productId}`);
                    continue; // Skip this image if it already exists for the product
                }

                // Determine if this image should be the main image
                let Ismain = false;
                if ("ismain" in body) {
                    if (ismain === i) {
                        Ismain = true; // Set the main image based on the index
                    }
                } else if( i === 0 ){
                    Ismain = true;
                }

                // Insert new image
                try {
                    await client.query('INSERT INTO image (product_id, image_url, ismain) VALUES ($1, $2, $3)', [productId, imageUrl, Ismain]);
                } catch (insertErr) {
                    return {
                        status: 400,
                        msg: insertErr.message,
                        data: null
                    };
                }
            }

            return {
                status: 200,
                msg: 'Images added successfully',
                data: { product_id: productId, image: image, ismain: ismain }
            };

        } catch (err) {
            return {
                status: 400,
                msg: err.message,
                data: null
            };
        }
    }

    async getImageByProduct(productId) {
        return new Promise(async (resolve, reject) => {
            try {
                await client.query(`
                SELECT * FROM image WHERE product_id = $1`
                    , [productId], async (err, res) => {
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
                            console.log(res.rows);
                            resolve({
                                status: 200,
                                msg: 'SUCCESS',
                                data: res.rows
                            });
                        }
                    })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    async deleteImage(product_id, image_url) {
        return new Promise(async (resolve, reject) => {
            try {
                await client.query(`
                    SELECT * FROM image 
                    WHERE product_id = $1 AND image_url = $2
                    `, [product_id, image_url], async (err, res) => {
                    if (err) {
                        reject(err.message);
                    }
                    else if (res.rows.length === 0) {
                        resolve({
                            status: 404,
                            msg: `The image is not exist in image table`,
                            data: null
                        });
                    } else {
                        console.log(res.rows[0])
                        if(res.rows[0].ismain === true){
                            let product_list = await client.query(`
                                SELECT * FROM image 
                                WHERE product_id = $1
                                ORDER BY image_url ASC
                                `, [product_id]);
                            let i = 0
                            console.log(product_list)
                            while(product_list.rows[i].image_url === image_url) i++;
                            await client.query(`
                                UPDATE image 
                                SET ismain = true
                                WHERE product_id = $1 AND image_url = $2
                                `, [product_id, product_list.rows[i].image_url]);
                        }
                        client.query(`
                            DELETE FROM image 
                            WHERE product_id = $1 AND image_url = $2
                            `, [product_id, image_url], (deleteErr, deleteRes) => {
                            if (deleteErr) {
                                reject(deleteErr.message);
                            } else {
                                resolve({
                                    status: 200,
                                    msg: "Product's image deleted successfully",
                                    data: null
                                });
                            }
                        });
                    }
                })
            }
            catch (errfindID) {
                reject(errfindID.msg);
            }
        })
    }

    async deleteImageByProduct(productId) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID
                try {
                    checkID = await this.findsomethingExistImage("product_id", productId)
                    console.log(checkID);
                }
                catch (errfindID) {
                    reject(errfindID.msg);
                }
                if (checkID.data.rows.length === 0) {
                    resolve({
                        status: 404,
                        msg: `The product_id is not exist in image table`,
                        data: null
                    });
                } else {
                    console.log(checkID.data.rows)
                    client.query(`
                        DELETE FROM image 
                        WHERE product_id = $1
                    `, [productId], (deleteErr, deleteRes) => {
                        if (deleteErr) {
                            reject(deleteErr.message);
                        } else {
                            resolve({
                                status: 200,
                                msg: "Product's images deleted successfully",
                                data: null
                            });
                        }
                    });
                }
            }
            catch (err) {
                reject(err.message);
            }
        });
    }

    async updateImage(query, body) {
        return new Promise(async (resolve, reject) => {
            try {
                const {product_id, image_url} = query;
                if("image_url" in query){
                    let res = await client.query(`
                        SELECT * FROM image 
                        WHERE product_id = $1 AND image_url = $2`
                        ,[product_id, image_url]);
                    if (res.rows.length === 0) {
                        return resolve({
                            status: 404,
                            msg: 'The image does not exist in image table',
                            data: null
                        });
                    }
                    if ("ismain" in body){
                        await client.query(
                            `UPDATE image 
                            SET ismain = $1 
                            WHERE product_id = $2 AND image_url = $3`,
                            [body.ismain, product_id, image_url]
                        );
                    }
                    let check = await client.query(`
                        SELECT * FROM image 
                        WHERE product_id = $1 AND image_url = $2`
                        ,[product_id, image_url]);
                    resolve({
                        status: 200,
                        msg: 'Update success',
                        data: check.rows[0]
                    });
                }else {
                    //xoá cái cũ
                    const del = await this.deleteImageByProduct(product_id);
                    console.log(del)
                    //thêm cái mới
                    const add = await this.addImage(product_id, body);
                    console.log(add)
                    resolve(add);
                }
            } catch (err) {
                reject(err.message);
            }
        });
    }

    async deletefileImage(imageUrl) {
        const filePath = imageUrl;

        if (!fs.existsSync(filePath)) {
            console.error(`Error: File '${filePath}' does not exist.`);
            return false; // Indicate failure
        }

        try {
            await fs.promises.unlink(filePath);
            console.log('Xóa file thành công!');
            return true; // Indicate success
        } catch (err) {
            console.error('Xóa file thất bại:', err);
            return false; // Indicate failure
        }
    }

    async CreateReview(product_id, newReview) {
        return new Promise(async (resolve, reject) => {
            const { uid, rating, comment } = newReview
            const exist =  await client.query(`
                SELECT EXISTS (
                    SELECT 1
                    FROM orders o
                    JOIN order_include oi ON o.oid = oi.oid
                    WHERE o.uid = $1 AND oi.product_id = $2
                );
            `, [uid, product_id]);
            let ex_flag     = exist.rows[0].exists
            if(!ex_flag){   // nếu khách chưa mua sản phẩm
                reject('Customer has not purchased the product')
            }
            // console.log(exist.rows[0].exists);
            client.query(`
                SELECT * FROM reviews
                WHERE uid = $1 AND product_id = $2
            `, [uid, product_id], async (err, res) => {
                if (err) {
                    reject(err.message);
                }
                else if (res.rows.length !== 0) {
                    // resolve({
                    //     status: 404,
                    //     msg: 'The Review is already exist',
                    //     data: null
                    // });
                    console.log("'The Review is already exist")
                    let update = await this.UpdateReview(product_id,newReview)
                    console.log(update)
                    resolve(update);
                }
                else {
                    try {
                        client.query(
                            `INSERT INTO reviews(product_id, uid, rating, comment) VALUES ($1, $2, $3, $4)`,
                            [product_id, uid, rating, comment],
                            async (err, res) => {
                                if (err) {
                                    console.log(err)
                                    // reject(err.message)
                                    throw new Error(err.message)
                                } else {
                                    resolve({
                                        status: 200,
                                        msg: "Create successfully!",
                                        data: newReview
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
    /*
    create table reviews(
        product_id	varchar(255)	not null,
        uid		varchar(100)	not null,
        rating		integer			not null check(rating >= 1 and rating <=5),
        comment	text,
        time		timestamp 		default now(),
        primary key(product_id, uid),
        constraint fk_review_prod foreign key(product_id) references product(product_id),
        constraint fk_cus_review	foreign key(uid) references users(uid)
    )
    */
    async UpdateReview(product_id, body) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
                    SELECT * 
                    FROM reviews 
                    WHERE product_id = $1 AND uid = $2
                    `, [product_id, body.uid], async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        })
                    }
                    else {
                        try {
                            for (const [key, value] of Object.entries(body)) {
                                if (key === "product_id" || key === "uid") continue;
                                await client.query(
                                    `UPDATE reviews SET ${key} = $1 WHERE product_id = $2 AND uid = $3`,
                                    [value, product_id, body.uid]
                                );
                            }
                            await client.query( // upadte time
                                `UPDATE reviews SET time = $1 WHERE product_id = $2 AND uid = $3`,
                                [new Date(), product_id, body.uid]
                            );
                            const updateReview = await client.query(`SELECT * FROM reviews WHERE product_id = $1 AND uid = $2`, [product_id, body.uid])

                            resolve({
                                status: 200,
                                msg: 'Update success',
                                data: updateReview.rows[0]
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
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        })
    }


    async GetReview(query) {
        return new Promise(async (resolve, reject) => {
            try {
                const {product_id, page, limit, uid} = query
                console.log(query)
                await client.query(`
                    SELECT *
                    FROM reviews
                    WHERE product_id = $1
                    ORDER BY 
                        CASE 
                            WHEN uid = $4 THEN 0
                            ELSE 1
                        END,
                        time DESC
                    LIMIT $3 OFFSET $2;
                    `, [product_id, page*limit, limit, uid], async (err, res) => {
                        if (err) {
                           reject(err.message);
                        }
                        else if (res.rows.length === 0) {
                            resolve({
                                status: 404,
                                msg: "The product's review is not exist",
                                data: null
                            });
                        }
                        else {
                            console.log(res.rows);
                            let count_res = await client.query(`
                                SELECT COUNT(*)
                                FROM reviews
                                WHERE product_id = $1
                            `, [product_id]);
                            const totalRows     = count_res.rows[0].count;
                            const tol_pag       = Math.ceil(totalRows/limit);
                            console.log(totalRows, tol_pag)
                            resolve({
                                status: 200,
                                msg: 'SUCCESS',
                                data: res.rows ,
                                total_page: tol_pag
                            });
                        }
                    })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    async DeleteReview(query) {
        return new Promise(async (resolve, reject) => {
            try {
                const {product_id, uid} = query
                let checkID = await client.query('SELECT * FROM reviews WHERE product_id = $1 AND uid = $2', [product_id, uid]);
                if (checkID.rows.length === 0) {
                    return resolve({
                        status: 404,
                        msg: `The review does not exist in the reviews table`,
                        data: null
                    });
                }

                // Xóa dữ liệu tùy theo điều kiện
                // const query = { sql: 'DELETE FROM reviews WHERE product_id = $1 AND uid = $2', params: [product_id, uid], successMsg: "User's review deleted successfully" };

                // Thực hiện truy vấn DELETE
                const deleteRes = await client.query('DELETE FROM reviews WHERE product_id = $1 AND uid = $2', [product_id, uid]);
                console.log(deleteRes);
                resolve({
                    status: 200,
                    msg: "User's review deleted successfully",
                    data: null
                });
            } catch (err) {     
                reject(err.message);
            }
        });
    }
}

module.exports = new ProductService;