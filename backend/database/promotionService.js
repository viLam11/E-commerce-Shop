const client = require('./database');
const { v4: uuidv4 } = require('uuid')

class PromotionService {
    constructor() {};

    async createPromotion(newPromotion) {
        return new Promise((resolve, reject)=>{
            const {pro_name, quantity, description, starttime, endtime, minspent, fix_value, percentage, max_amount, discount_type, apply_range} = newPromotion
            client.query(`
                SELECT * FROM promotion
                WHERE pro_name = $1
            `, [pro_name], (err, res) => {
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
                        msg: 'The promotion is already exist',
                        data: null
                    });
                }
                else {
                    try{
                    const promotionId = uuidv4();
                client.query(
                `INSERT INTO promotion( promotion_id, pro_name, quantity, description, starttime, endtime, minspent, fix_value, percentage, max_amount, discount_type, apply_range) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [promotionId, pro_name, quantity, description, starttime, endtime, minspent, fix_value, percentage, max_amount, discount_type, apply_range],
            (err, res) => {
                if (err) {
                    console.log(err)
                    reject( {
                        status: 400,
                        msg: err.message,
                        data: null
                    })
                } else {
                    resolve( {
                        status: 200,
                        msg: "Create successfully!",
                        data: newPromotion
                    })
                }
            }
        )
        client.end;
    }
        catch(e){
            reject(e)
        }
        // resolve({
        //     status: 200
        // });
                }
            })
         })
    }

    async updatePromotion(id, data) {
        return new Promise(async (resolve, reject) => {
            client.query(`
                SELECT * FROM promotion
                WHERE promotion_id = $1
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
                        SELECT * FROM promotion WHERE pro_name = $1`, [data.pro_name], async (err, res) => {
                        if (err) {
                            reject({
                                status: 400,
                                msg: err.message,
                                data: null
                            });
                        }
                        else if (res.rows.length !== 0 && res.rows[0].promotion_id !== id ) {
                            console.log(res.rows)
                            resolve({
                                status: 404,
                                msg: 'The promotion_name is already exist',
                                data: null
                            });
                        }
                        else{
                            try {
                                for (const [key, value] of Object.entries(data)) {
                                    await client.query(`UPDATE promotion SET ${key} = $1 WHERE promotion_id = $2`,[value, id]);
                                }
                
                                const updatepromotion = await client.query(`SELECT * FROM promotion WHERE promotion_id = $1`, [id])
                
                                resolve({
                                    status: 200,
                                    msg: 'Update success',
                                    data: updatepromotion.rows[0]
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
    
    async deletePromotion(id) {
        return new Promise((resolve, reject) => {
          // Kiểm tra xem sản phẩm có tồn tại không
          client.query(`
            SELECT * FROM promotion WHERE promotion_id = $1
          `, [id], (err, res) => {
            if (err) {
              reject({
                status: 400,
                msg: err.message,
                data: null
              });
            } else if (res.rows.length === 0) {
              resolve({
                status: 404,
                msg: "The promotion with the specified ID does not exist",
                data: null
              });
            } else {
              // Nếu sản phẩm tồn tại, thực hiện xóa
              client.query(`
                DELETE FROM promotion WHERE promotion_id = $1
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
                    msg: "Promotion deleted successfully",
                    data: null
                  });
                }
              });
            }
          });
        });
    };
      
}

module.exports = new PromotionService;