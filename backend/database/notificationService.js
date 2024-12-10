const client = require('./database')

class NotificationService {
    async CreateNotification(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const exist = await client.query(`SELECT * FROM notification WHERE uid = $1 AND content = $2`, [body.uid, body.content])
                console.log(exist)

                if (exist.rows.length > 0) {
                    return resolve({
                        status: 400, // Conflict
                        msg: "Notification already exists",
                        data: null
                    });
                }
                const result = await client.query(`INSERT INTO notification (uid, content) VALUES ($1, $2) RETURNING *`,[body.uid, body.content]);

                resolve({
                    status: 200, // Created
                    msg: "Notification created successfully",
                    data: result.rows[0]
                });
            } catch (err) {
                reject({
                    status: 404,
                    msg: err,
                    data: null
                });
            }
        })
    }

    async GetNotification(uid) {
        return new Promise(async (resolve, reject) => {
            try {
                const notify = await client.query(
                    `SELECT * FROM notification 
                    WHERE uid = $1 OR uid ='ALL'
                    ORDER BY create_date DESC`, 
                    [uid]);
                if (notify.rows.length === 0) {
                    return {
                        status: 404, // Not Found
                        msg: "No notifications found",
                        data: null
                    };
                }
                resolve({
                    status: 200, // Created
                    msg: "Notifications retrieved successfully",
                    data: notify.rows
                });
            } catch (err) {
                reject({
                    status: 404,
                    msg: err,
                    data: null
                });
            }
        })
    }

    async UpdateNotification(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const update = await client.query(
                    `UPDATE notification 
                    SET content = $1
                    WHERE uid = $2 AND content = $3`, 
                    [body.update_content, body.uid, body.content]);
                // console.log(update)
                resolve({
                    status: 200, // Created
                    msg: "Update Notifications successfully",
                    data: body
                });
            } catch (err) {
                reject(err.detail);
            }
        })
    }

    async DeleteNotification(body) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("check1")
                const del = await client.query(
                    `DELETE FROM notification 
                    WHERE uid = $1 AND content = $2`, 
                    [body.uid, body.content]);
                
                // Kiểm tra số bản ghi bị ảnh hưởng
                if (del.rowCount > 0) {
                    console.log("check2")
                    resolve({
                        status: 200, // Success
                        msg: "Delete notification successfully",
                        data: null
                    });
                } else {
                    console.log("check3")
                    resolve({
                        status: 404, // Not Found
                        msg: "No notification found to delete",
                        data: null
                    });
                }
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = new NotificationService;