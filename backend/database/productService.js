const client = require('./database');
const { v4: uuidv4 } = require('uuid')
const path = require('path');
const fs = require('fs');
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
                            async (err, res) => {
                                if (err) {
                                    console.log(err)
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
                                        try {
                                            await this.addImage(productId, obj, obj.image);  // ensure this is an async function
                                        } catch (error) {
                                            console.log(error);
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
                                if (key === "product_id") continue;
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
                            res.rows[i].image = image.data.map(item => item.image_url);
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
                        res.rows[i].image = image.data.map(item => item.image_url);
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

    async addImage(productId, body, file) {
        try {
            const images = file.map(obj => obj.path)
            const isArray = Array.isArray(images);
            console.log(images);

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
            for (let i = 0; true; i++) {
                let imageUrl = isArray ? images[i] : images; // Handle case when images is not an array

                // Check if image already exists
                const checkImage = await client.query('SELECT * FROM image WHERE product_id = $1 AND image_url = $2', [productId, imageUrl]);
                if (checkImage.rows.length !== 0) {
                    console.log(`Image URL ${imageUrl} already exists for this product`);
                    continue; // Skip this image if it already exists for the product
                }

                // Determine if this image should be the main image
                let Ismain = false;
                if ("ismain" in body) {
                    //console.log("Found 'ismain' in data");
                    if (!isArray && body.ismain === true) {
                        Ismain = true; // If only one image is provided, set it as main
                    } else {
                        const ismainIndex = Number(body.ismain);
                        if (!isNaN(ismainIndex) && ismainIndex === i) {
                            Ismain = true; // Set the main image based on the index
                        }
                    }
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

                if (isArray && i == images.length - 1) break;
                if (!isArray) break;
            }

            return {
                status: 200,
                msg: 'Images added successfully',
                data: { product_id: productId, image: images, ismain: body.ismain }
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
                client.query(`
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
                //checkID = await this.findsomethingExistImage("image_url", image_url)
                client.query('SELECT * FROM image WHERE product_id = $1 AND image_url = $2', [product_id, image_url], (err, res) => {
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
                            msg: `The image is not exist in image table`,
                            data: null
                        });
                    } else {
                        const delres = this.deletefileImage(image_url); // xoá file của ảnh
                        if (!delres) {
                            reject({
                                status: 400,
                                msg: "error when delete file image",
                                data: null
                            });
                        } else {
                            client.query(`DELETE FROM image WHERE product_id = $1 AND image_url = $2`, [product_id, image_url], (deleteErr, deleteRes) => {
                                if (deleteErr) {
                                    reject({
                                        status: 400,
                                        msg: deleteErr.message,
                                        data: null
                                    });
                                } else {
                                    resolve({
                                        status: 200,
                                        msg: "Product's image deleted successfully",
                                        data: null
                                    });
                                }
                            });
                        }
                    }
                })
            }
            catch (errfindID) {
                reject({
                    status: 400,
                    msg: errfindID.msg,
                    data: null
                });
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
                    reject({
                        status: 400,
                        msg: errfindID.msg,
                        data: null
                    });
                }
                if (checkID.data.rows.length === 0) {
                    resolve({
                        status: 404,
                        msg: `The product_id is not exist in image table`,
                        data: null
                    });
                } else {
                    console.log(checkID.data.rows)
                    let allimg = checkID.data.rows.map(obj => obj.image_url)
                    allimg.forEach(async (url) => {
                        try {
                            await this.deletefileImage(url);
                            console.log(`Deleted file: ${url}`);
                        } catch (error) {
                            console.error(`Error deleting file: ${url}`, error);
                        }
                    });
                    client.query(`
                        DELETE FROM image WHERE product_id = $1
                    `, [productId], (deleteErr, deleteRes) => {
                        if (deleteErr) {
                            reject({
                                status: 400,
                                msg: deleteErr.message,
                                data: null
                            });
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
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        });
    }

    async updateImage(product_id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = ("image_url" in data) ? await client.query(`SELECT * FROM image WHERE product_id = $1 AND image_url = $2`,
                    [product_id, data.image_url]) : await client.query(`SELECT * FROM image WHERE product_id = $1`, [product_id]);
                if (res.rows.length === 0) {
                    return resolve({
                        status: 404,
                        msg: 'The image does not exist',
                        data: null
                    });
                }
                //console.log(data);
                if ("image_url" in data && "ismain" in data && data.image.length > 0) {
                    console.log("lỗi cú pháp")

                    let newImages = data.image.map(img => img.path);
                    console.log(newImages)
                    // Xóa các ảnh mới
                    newImages.forEach(async (url) => {
                        try {
                            await this.deletefileImage(url);
                            console.log(`Deleted file: ${url}`);
                        } catch (error) {
                            console.error(`Error deleting file: ${url}`, error);
                        }
                    });
                }
                else if ("image_url" in data && "ismain" in data && data.image.length === 0) {
                    // Chỉ sửa ismain
                    await client.query(
                        `UPDATE image SET ismain = $1 WHERE product_id = $2 AND image_url = $3`,
                        [data.ismain, product_id, data.image_url]
                    );
                }
                else if (!("image_url" in data) && data.image.length > 0) {
                    // Thêm ảnh mới
                    await this.addImage(product_id, data, data.image);

                    // Chỉ sửa có trường image
                    let oldImages = res.rows.map(obj => obj.image_url);

                    // Xóa các ảnh cũ
                    for (const url of oldImages) {
                        try {
                            await this.deleteImage(product_id, url);
                            console.log(`Deleted file: ${url}`);
                        } catch (error) {
                            console.error(`Error deleting file: ${url}`, error);
                        }
                    }
                }
                resolve({
                    status: 200,
                    msg: 'Update success',
                    data: null
                });
            } catch (err) {
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        });
    }

    // async renameFileWithValidation(image_url) {
    //     // 1. Construct the file path (handle potential path separators)
    //     const sanitizedImageUrl = image_url.replace(/\\|\//g, path.sep); // Replace backslashes or forward slashes with the appropriate system separator
    //     let filePath = path.join(__dirname, sanitizedImageUrl); // Adjust __dirname if needed
    //     filePath = filePath.replace('database\\', '');
    //     // 2. Validate file existence
    //     if (!fs.existsSync(filePath)) {
    //       console.error(`Error: File '${filePath}' does not exist.`);
    //       return null; // Exit the function if file doesn't exist
    //     }

    //     // 3. Extract filename and handle edge cases
    //     const fileName = path.basename(filePath);
    //     console.log('File name:', fileName);

    //     // 4. Update filename (optional prepend product ID)
    //       let updatedFileName = fileName;
    //       updatedFileName = updatedFileName.replace(/\d+(?=\.csv)/, Date.now());
    //       console.log("Updated file name:", updatedFileName);
    //       //updatedFileName = `image\\${updatedFileName}`;
    //     // 5. Perform file renaming with error handling
    //     fs.rename(filePath, updatedFileName, (err) => {
    //       if (err) {
    //         console.error('Error renaming file:', err);
    //         // Handle errors appropriately (e.g., logging, retries, notifications)
    //       } else {
    //         console.log('File renamed successfully!');
    //       }
    //     });
    //     return updatedFileName;
    // }

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
}



module.exports = new ProductService;