const client = require('./database');
const {v4: uuidv4} = require('uuid')
class UserService {
    constructor() {};

    async createUser(username, password, email) {
        const userId = uuidv4();
        client.query(
            `INSERT INTO users( id, username, password, email) VALUES ($1, $2, $3, $4)`,
            [userId, username, password, email],
            (err, res) => {
                if(err) {
                    console.log(err)
                    return {
                        status: 400,
                        msg: err.message,
                        data: null
                    }
                } else {
                    return {
                        status: 200,
                        msg: "Create successfully!",
                        data: null
                    }
                }
            } 
        )
        client.end;
    }
    

    async fetchUsers(limit = 10) {
        return new Promise((resolve, reject) => {
            client.query(
                `SELECT * FROM users LIMIT $1`, 
                [limit],
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
                            msg: 'Fetch success',
                            data: res.rows
                        });
                    }
                }
            );
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
                } else {
                    resolve({
                        status: 200,
                        msg: 'Fetch success',
                        data: res.rows
                    });
                }
            })
        })
    }
}



module.exports = new UserService;