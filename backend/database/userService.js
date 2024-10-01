const client = require('./database');

class UserService {
    constructor() {};

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
}

module.exports = new UserService;