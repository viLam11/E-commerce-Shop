const client = require('./database');
const { v4: uuidv4 } = require('uuid');
const CreateID = require('../createID')
class UserService {
    constructor() { };



    async createCustomer(username, password, data) {
        return new Promise((resolve, reject) => {
            const userId = CreateID.generateID('uid');
            const { lname, fname, gender, email, userType, birthday } = data
            client.query(
                `INSERT INTO users( uid, username, upassword, email, userType, lname, fname, gender, birthday, ranking) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [userId, username, password, email, userType, lname, fname, gender, birthday, 'silver'],
                (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        })
                    } else {
                        resolve({
                            status: 200,
                            msg: "Create successfully!",
                            data: null
                        })
                    }
                }
            )
            client.end;
        })
    }

    async createAdmin(username, password, data) {
        return new Promise((resolve, reject) => {
            const userId = CreateID.generateID('uid');
            const { lname, fname, gender, email, userType, id_no } = data
            client.query(
                `INSERT INTO users( uid, username, upassword, email, userType, lname, fname, gender, id_no) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [userId, username, password, email, userType, lname, fname, gender, id_no],
                (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        })
                    } else {
                        resolve({
                            status: 200,
                            msg: "Create successfully!",
                            data: null
                        })
                    }
                }
            )
            client.end;
        })
    }

    async countUsers() {
        return new Promise((resolve, reject) => {
            client.query(`SELECT COUNT(*) AS total FROM users`, (err, res) => {
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


    async sortUsers(sort, limit, offset) {
        return new Promise((resolve, reject) => {
            const allowedColumns = ['uid', 'username', 'upassword', 'fname', 'lname', 'email', 'gender', 'userType', 'birthday', 'total_payment', 'id_no']
            //ranking cần xếp lại

            let order = 'ASC';
            let column = 'uid';

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
                //`SELECT * FROM users ORDER BY ${column} ${order} LIMIT $1 OFFSET $2`,
                `SELECT 
                    u.*,
                    array_agg(DISTINCT up.phone) AS phone,
                    array_agg(DISTINCT jsonb_build_object(
                        'address', ua.address,
                        'isdefault', ua.isdefault
                    )) AS address
                FROM users u
                LEFT JOIN user_phone up ON u.uid = up.uid
                LEFT JOIN user_address ua ON u.uid = ua.uid
                GROUP BY u.uid
                ORDER BY ${column} ${order}
                LIMIT $1 OFFSET $2`,
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
    //const columns = "username"
    //const searchChars = filter[1].split('');

    //const likeConditions = searchChars.map(char => `${filter[0]} ILIKE '%${char}%'`).join(' AND ');
    //const likeConditions = columns.map(column => { const conditions = filter.map(char => `${column} ILIKE '%${char}%'`).join(' AND ') }).join(' OR ')

    async filterUser(filter, limit, offset) {
        return new Promise(async (resolve, reject) => {
            const columns = ['username', 'email', 'lname', 'fname', 'id_no'];// thiếu , 'gender', 'userType'

            const keywords = filter.split(' ');

            // Tạo điều kiện LIKE với từng từ trên từng cột
            const likeConditions = columns.map(column => {// chưa sửa được việc xét các cột giá trị enum
                const conditions = keywords.map(word => `${column} ILIKE '%${word}%'`).join(' OR ');
                return `(${conditions})`;
            }).join(' OR '); // Kết hợp các điều kiện cột bằng OR
            //console.log("check", likeConditions)
            //const query = `SELECT * FROM users WHERE ${likeConditions} LIMIT $1 OFFSET $2`
            const query = `SELECT 
                                u.*,
                                array_agg(DISTINCT up.phone) AS phone,
                                array_agg(DISTINCT jsonb_build_object(
                                    'address', ua.address,
                                    'isdefault', ua.isdefault
                                )) AS address
                            FROM users u
                            LEFT JOIN user_phone up ON u.uid = up.uid
                            LEFT JOIN user_address ua ON u.uid = ua.uid
                            WHERE ${likeConditions}
                            GROUP BY u.uid
                            LIMIT $1 OFFSET $2`
            const countQuery = `SELECT COUNT(*) AS total FROM users WHERE ${likeConditions}`
            let count;
            try {
                count = await new Promise((resolve, reject) => {
                    client.query(countQuery, (err, countRes) => {
                        if (err) {
                            console.log("check")
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
            } catch (err) {
                console.error('Error fetching count:', err);
                throw err; // Hoặc xử lý lỗi phù hợp
            }
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

    async fetchUsers(limit, page, filter, sort) {
        return new Promise(async (resolve, reject) => {
            try {
                let countUser = await this.countUsers()
                if (filter) {
                    const userFilter = await this.filterUser(filter, limit, limit * page)
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: userFilter.data.rows,
                        totalUser: userFilter.countData,
                        currentPage: page + 1,
                        totalPage: Math.ceil(userFilter.countData / limit)
                    });
                }
                if (sort) {
                    const users = await this.sortUsers(sort, limit, limit * page)
                    resolve({
                        status: 200,
                        msg: 'SUCCESS',
                        data: users.data,
                        totalUser: countUser.data,
                        currentPage: page + 1,
                        totalPage: Math.ceil(countUser.data / limit)
                    });
                }
                client.query(
                    //`SELECT * FROM users LIMIT $1 OFFSET $2`,
                    `SELECT 
                        u.*,
                        array_agg(DISTINCT up.phone) AS phone,
                        array_agg(DISTINCT jsonb_build_object(
                            'address', ua.address,
                            'isdefault', ua.isdefault
                        )) AS address
                    FROM users u
                    LEFT JOIN user_phone up ON u.uid = up.uid
                    LEFT JOIN user_address ua ON u.uid = ua.uid
                    GROUP BY u.uid
                    LIMIT $1 OFFSET $2`,
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
                                totalUser: countUser.data,
                                currentPage: page + 1,
                                totalPage: Math.ceil(countUser.data / limit)
                            });
                        }
                    }
                );
            }
            catch (err) {
                reject(err)
            }
        });
    }

    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            client.query(`
                SELECT * FROM users
                WHERE email = $1
            `, [email], (err, res) => {
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
                        msg: 'The email is not exist',
                        data: null
                    });
                }
                else {
                    resolve({
                        status: 200,
                        msg: 'Fetch success',
                        data: res.rows
                    });
                }
            })
        })
    }

    async updateUser(id, data) {
        return new Promise((resolve, reject) => {
            client.query(`
                SELECT * FROM users
                WHERE uid = $1
            `, [id], (err, res) => {
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
                        msg: 'The id is not exist',
                        data: null
                    });
                }
                else {
                    client.query(`
                        SELECT * FROM users
                        WHERE email = $1
                    `, [data.email], async (err, res) => {
                        if (err) {
                            reject({
                                status: 400,
                                msg: err.message,
                                data: null
                            });
                        }
                        else if (res.rows.length > 1) {
                            resolve({
                                status: 404,
                                msg: `${data.username} đã tồn tại`,
                                data: null
                            });
                        }
                        else {
                            try {
                                for (const [key, value] of Object.entries(data)) {
                                    if (key === "uid") continue;
                                    await client.query(
                                        `UPDATE users SET ${key} = $1 WHERE uid = $2`,
                                        [value, id]
                                    );
                                }

                                const updateuser = await client.query(`SELECT * FROM users WHERE uid = $1`, [id])

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
            })
        })
    }

    async deleteUser(id) {
        return new Promise(async (resolve, reject) => {
            client.query(`
                SELECT * FROM users
                WHERE uid = $1
            `, [id], async (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                }
                else if (res.rows.length === 0) {
                    //console.log("check")
                    resolve({
                        status: 404,
                        msg: 'The id is not exist',
                        data: null
                    });
                }
                else {
                    try {
                        await client.query(`DELETE FROM users WHERE uid = $1 RETURNING *`, [id]);
                        resolve({
                            status: 200,
                            msg: 'Delete success',
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
        })
    }

    async getDetailUser(id) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
                SELECT 
                    u.*, 
                    array_agg(DISTINCT up.phone) AS phone, 
                    array_agg(DISTINCT jsonb_build_object(
                        'address', ua.address,
                        'isdefault', ua.isdefault
                    )) AS address
                FROM users u
                LEFT JOIN user_phone up ON u.uid = up.uid
                LEFT JOIN user_address ua ON u.uid = ua.uid
                WHERE u.uid = $1
                GROUP BY u.uid;
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
                            msg: 'The user is not exist',
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

    // async createAddress(userId, body) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const isArray = Array.isArray(body.address);
    //             const checkUser = await this.findsomethingExist("users", "uid", userId);
    //             if (checkUser.data.rows.length === 0) {
    //                 resolve({
    //                     status: 404,
    //                     msg: `The uid does not exist`,
    //                     data: null
    //                 });
    //             }

    //             for (let i = 0; true; i++) {
    //                 let Address = isArray ? body.address[i] : body.address; // Handle case when images is not an array
    //                 const checkAddress = await client.query('SELECT * FROM user_address WHERE uid = $1 AND address = $2', [userId, body.address]);
    //                 if (checkAddress.rows.length !== 0) {
    //                     continue;
    //                 }

    //                 let Isdefault = false;
    //                 if ("isdefault" in body) {
    //                     //console.log("Found 'ismain' in data");
    //                     if (!isArray && body.isdefault === true) {
    //                         Isdefault = true; // If only one image is provided, set it as main
    //                     } else {
    //                         const IsdefaultIndex = Number(body.isdefault);
    //                         if (!isNaN(IsdefaultIndex) && IsdefaultIndex === i) {
    //                             Isdefault = true; // Set the main image based on the index
    //                         }
    //                     }
    //                 }

    //                 try {
    //                     await client.query('INSERT INTO user_address (uid, address, isdefault) VALUES ($1, $2, $3)', [userId, Address, Isdefault]);
    //                 } catch (insertErr) {
    //                     reject({
    //                         status: 400,
    //                         msg: insertErr.message,
    //                         data: null
    //                     });
    //                 }
    //                 if (isArray && i == body.address.length - 1) break;
    //                 if (!isArray) break;
    //             }

    //             resolve({
    //                 status: 200,
    //                 msg: 'Address added successfully',
    //                 data: { uid: userId, address: body.address }
    //             });

    //         }
    //         catch (err) {
    //             reject({
    //                 status: 400,
    //                 msg: err.message,
    //                 data: null
    //             });
    //         }
    //     })
    // }

    async createAddress(uid, body) {
        try {
            await client.query('BEGIN')
            if (body.isdefault) {
                await client.query(`
                    UPDATE user_address
                    SET isdefault = $1
                    WHERE uid = $2
                `, [false, uid])
                await client.query(`
                    INSERT INTO user_address (uid, address, isdefault)
                    VALUES ($1, $2, $3)
                `, [uid, body.address, body.isdefault])
            }
            else {
                const cad = await client.query(`
                    SELECT * FROM user_address
                    WHERE uid = $1
                `, [uid])
                if (cad.rows.length <= 0) {
                    await client.query(`
                        INSERT INTO user_address (uid, address, isdefault)
                        VALUES ($1, $2, $3)
                    `, [uid, body.address, true])
                }
                else {
                    await client.query(`
                        INSERT INTO user_address (uid, address, isdefault)
                        VALUES ($1, $2, $3)
                    `, [uid, body.address, body.isdefault])
                }

            }
            await client.query('COMMIT')
            return {
                status: 200,
                msg: "Add successfully",
                data: body
            }
        }
        catch (err) {
            await client.query('ROLLBACK')
            return {
                status: 400,
                msg: err.message,
                data: null
            }
        }
    }
    // async updateAddress(uid, body) {
    //     return new Promise(async (resolve, reject) => {
    //         client.query(`SELECT * FROM user_address WHERE uid = $1`,
    //             [uid], (err, res) => {
    //                 if (err) {
    //                     reject({
    //                         status: 400,
    //                         msg: err.message,
    //                         data: null
    //                     });
    //                 }
    //                 else if (res.rows.length === 0) {
    //                     resolve({
    //                         status: 404,
    //                         msg: 'The id is not exist',
    //                         data: null
    //                     });
    //                 }
    //                 else {
    //                     try {
    //                         for (const [key, value] of Object.entries(body)) {
    //                             if (key === "user_id") continue;
    //                             else if (key === "isdefault" && "address" in body && !("upaddress" in body)) {
    //                                 client.query(`UPDATE user_address SET ${key} = $1 WHERE uid = $2 AND address = $3`, [value, uid, body.address]);
    //                             }
    //                             else if (key === "upaddress") {
    //                                 client.query(`DELETE FROM user_address WHERE uid = $1`, [uid])
    //                                 let tmp = body.upaddress;
    //                                 body.address = tmp;
    //                                 this.createAddress(uid, body);
    //                             }

    //                         }
    //                         resolve({
    //                             status: 200,
    //                             msg: 'Update success',
    //                             data: null
    //                         });
    //                     } catch (updateErr) {
    //                         reject({
    //                             status: 400,
    //                             msg: updateErr.message,
    //                             data: null
    //                         });
    //                     }

    //                 }
    //             })
    //     })
    // }

    async updateAddress(uid, body) {
        try {
            await client.query('BEGIN')
            if (body.isdefault) {
                await client.query(`
                    UPDATE user_address
                    SET isdefault = $1
                    WHERE uid = $2
                `, [false, uid])
                await client.query(`
                    UPDATE user_address
                    SET isdefault = $1, address = $2
                    WHERE uid = $3 and address = $4
                `, [true, body.new_address, uid, body.old_address])
            }
            else {
                await client.query(`
                    UPDATE user_address
                    SET isdefault = $1, address = $2
                    WHERE uid = $3 and address = $4
                `, [body.isdefault, body.new_address, uid, body.old_address])
            }
            await client.query('COMMIT')
            return {
                status: 200,
                msg: "Add successfully",
                data: body
            }
        }
        catch (err) {
            await client.query('ROLLBACK')
            return {
                status: 400,
                msg: err.message,
                data: null
            }
        }
    }

    async deleteAddress(uid, body) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID;

                // Kiểm tra điều kiện để xác định truy vấn
                if (!("address" in body)) {
                    checkID = await this.findsomethingExist("user_address", "uid", uid);
                } else {
                    const res = await client.query('SELECT * FROM user_address WHERE uid = $1 AND address = $2', [uid, body.address]);
                    if (res.rows.length === 0) {
                        return resolve({
                            status: 404,
                            msg: `The address does not exist in the address table`,
                            data: null
                        });
                    }
                    checkID = res.rows;
                }

                // Xóa dữ liệu tùy theo điều kiện
                const query = ("address" in body)
                    ? { sql: 'DELETE FROM user_address WHERE uid = $1 AND address = $2', params: [uid, body.address], successMsg: "User's address deleted successfully" }
                    : { sql: 'DELETE FROM user_address WHERE uid = $1', params: [uid], successMsg: "All addresses deleted successfully" };

                // Thực hiện truy vấn DELETE
                const deleteRes = client.query(query.sql, query.params);
                console.log(deleteRes);
                resolve({
                    status: 200,
                    msg: query.successMsg,
                    data: null
                });
            } catch (err) {
                // Bắt lỗi truy vấn hoặc lỗi logic
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        });
    }

    async getAllAddress(uid) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`
            SELECT * FROM user_address WHERE uid = $1`
                    , [uid], async (err, res) => {
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
                                msg: 'The uid is not exist',
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

    /*
    create table user_phone(
    uid			varchar(100)	not null,
    phone		varchar(11)		not null,
    primary key(uid, phone),
    constraint fk_user_phone	foreign key(uid)
                                references users(uid)
    */
    async createPhone(user_id, body) {
        try {
            const phones = body.phone
            const isArray = Array.isArray(phones);
            //console.log(phone);

            // Check if product exists
            const checkUser = await this.findsomethingExist("users", "uid", user_id);
            if (checkUser.data.rows.length === 0) {
                return {
                    status: 404,
                    msg: `The uid does not exist`,
                    data: null
                };
            }

            // Add phone to the phone table
            for (let i = 0; true; i++) {
                let phone = isArray ? phones[i] : phones; // Handle case when images is not an array

                // Check if phone already exists
                const checkPhone = await client.query('SELECT * FROM user_phone WHERE uid = $1 AND phone = $2', [user_id, phone]);
                if (checkPhone.rows.length !== 0) {
                    console.log(`Phone: ${phone} already exists for this product`);
                    continue; // Skip this image if it already exists for the product
                }

                // Insert new phone
                try {
                    await client.query('INSERT INTO user_phone (uid, phone) VALUES ($1, $2)', [user_id, phone]);
                } catch (insertErr) {
                    return {
                        status: 400,
                        msg: insertErr.message,
                        data: null
                    };
                }

                if (isArray && i == phones.length - 1) break;
                if (!isArray) break;
            }

            return {
                status: 200,
                msg: 'Phone added successfully',
                data: { uid: user_id, phone: phones }
            };

        } catch (err) {
            return {
                status: 400,
                msg: err.message,
                data: null
            };
        }
    }


    async getPhone(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                client.query(`SELECT * FROM user_phone WHERE uid = $1`
                    , [user_id], async (err, res) => {
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
                                msg: 'The phone is not exist',
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

    async deletePhone(user_id, body) {
        return new Promise(async (resolve, reject) => {
            try {
                let checkID;

                // Kiểm tra điều kiện để xác định truy vấn
                if (!("phone" in body)) {
                    checkID = await this.findsomethingExist("user_phone", "uid", user_id);
                } else {
                    const res = await client.query('SELECT * FROM user_phone WHERE uid = $1 AND phone = $2', [user_id, body.phone]);
                    if (res.rows.length === 0) {
                        return resolve({
                            status: 404,
                            msg: `The phone does not exist in the phone table`,
                            data: null
                        });
                    }
                    checkID = res.rows;
                }

                // Xóa dữ liệu tùy theo điều kiện
                const query = ("phone" in body)
                    ? { sql: 'DELETE FROM user_phone WHERE uid = $1 AND phone = $2', params: [user_id, body.phone], successMsg: "User's phone deleted successfully" }
                    : { sql: 'DELETE FROM user_phone WHERE uid = $1', params: [user_id], successMsg: "All phones deleted successfully" };

                // Thực hiện truy vấn DELETE
                const deleteRes = client.query(query.sql, query.params);
                console.log(deleteRes);
                resolve({
                    status: 200,
                    msg: query.successMsg,
                    data: null
                });
            } catch (err) {
                // Bắt lỗi truy vấn hoặc lỗi logic
                reject({
                    status: 400,
                    msg: err.message,
                    data: null
                });
            }
        });
    }
}



module.exports = new UserService;