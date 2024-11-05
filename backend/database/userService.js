const client = require('./database');
const { v4: uuidv4 } = require('uuid')
class UserService {
    constructor() { };

    async createCustomer(username, password, data) {
        return new Promise((resolve, reject) => {
            const userId = uuidv4();
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
            const userId = uuidv4();
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
            if (sort === undefined) {
                sort = ['ASC', 'uid']
            }
            else if (typeof (sort) === "string") {
                if (allowedColumns.includes(sort)) {
                    sort = ['ASC', sort]
                } else {
                    sort = [(sort.toUpperCase() === 'DESC') ? 'DESC' : 'ASC', 'uid']
                }
            }
            else {
                sort[0] = (sort[0] === 'DESC' || sort[0].toUpperCase() === 'DESC') ? sort[0].toUpperCase() : 'ASC'
                sort[1] = allowedColumns.includes(sort[1]) ? sort[1] : 'uid'
            }
            client.query(
                `SELECT * FROM users ORDER BY ${sort[1]} ${sort[0]} LIMIT $1 OFFSET $2`,
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

    async filterUser(filter, limit, offset) { //của chatgpt giúp tìm kí tự bất kì có trong chuỗi
        return new Promise(async (resolve, reject) => {
            const columns = ['username', 'email', 'lname', 'fname', 'id_no'];
            filter = filter.split('')
            const likeConditions = columns.map(column => {
                const conditions = filter.map(char => `${column} ILIKE '%${char}%'`).join(' AND ');
                return `(${conditions})`;
            }).join(' OR ');

            const query = `SELECT * FROM users WHERE ${likeConditions} LIMIT $1 OFFSET $2`
            const countQuery = `SELECT COUNT(*) AS total FROM users WHERE ${likeConditions}`
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
                        data: users,
                        totalUser: countUser.data,
                        currentPage: page + 1,
                        totalPage: Math.ceil(countUser.data / limit)
                    });
                }
                client.query(
                    `SELECT * FROM users LIMIT $1 OFFSET $2`,
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
                        else if (res.rows.length !== 0) {
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
}



module.exports = new UserService;