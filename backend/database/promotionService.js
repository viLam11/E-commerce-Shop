const client = require('./database');
const CreateID = require('../createID')

class PromotionService {
    constructor() { };

    async createPromotion(newPromotion) {
        return new Promise(async (resolve, reject) => {
            const { name, quantity, description, starttime, endtime, minspent, discount_type, value, percentage, max_amount, apply_range, apply_id } = newPromotion;
            try {
                // Kiểm tra nếu chương trình khuyến mãi đã tồn tại
                client.query(`SELECT * FROM promotion WHERE name = $1`, [name], async (err, res) => {
                    if (err) {
                        reject({
                            status: 400,
                            msg: err.message,
                            data: null
                        });
                    } else if (res.rows.length !== 0) {
                        resolve({
                            status: 404,
                            msg: 'The promotion is already exist',
                            data: null
                        });
                    } else {
                        // Đợi getCount hoàn thành trước khi tiếp tục
                        //const promotionId = "PID" + await getCount(); // Đảm bảo getCount trả về một Promise hoặc là một hàm async
                        const promotionId = CreateID.generateID("promotion");
                        // Sau khi getCount hoàn tất, tiếp tục thực hiện chèn dữ liệu
                        client.query(
                            `INSERT INTO promotion(promotion_id, name, quantity, description, starttime, endtime, minspent, discount_type, value, percentage, max_amount, apply_range, apply_id) 
                             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                            [promotionId, name, quantity, description, starttime, endtime, minspent, discount_type, value, percentage, max_amount, apply_range, apply_id],
                            (err, res) => {
                                if (err) {
                                    console.log(err);
                                    reject({
                                        status: 400,
                                        msg: err.message,
                                        data: null
                                    });
                                } else {
                                    resolve({
                                        status: 200,
                                        msg: "Create successfully!",
                                        data: newPromotion
                                    });
                                }
                            }
                        );
                    }
                });
            } catch (err) {
                reject({
                    status: 404,
                    msg: err.message,
                    data: null
                });
            }
        });
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
                        SELECT * FROM promotion WHERE name = $1`, [data.name], async (err, res) => {
                        if (err) {
                            reject({
                                status: 400,
                                msg: err.message,
                                data: null
                            });
                        }
                        else if (res.rows.length !== 0 && res.rows[0].promotion_id !== id) {
                            console.log(res.rows)
                            resolve({
                                status: 404,
                                msg: 'The promotion name is already exist',
                                data: null
                            });
                        }
                        else {
                            try {
                                for (const [key, value] of Object.entries(data)) {
                                    await client.query(`UPDATE promotion SET ${key} = $1 WHERE promotion_id = $2`, [value, id]);
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
    }

    async getPromotion(id) {
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
                    // Nếu sản phẩm tồn tại, thực hiện load lên
                    resolve({
                        status: 200,
                        msg: "Get promotion successfully",
                        data: res.rows[0]
                    });
                }
            });
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            // Kiểm tra xem sản phẩm có tồn tại không
            client.query(`
              SELECT * FROM promotion
            `, (err, res) => {
                if (err) {
                    reject({
                        status: 400,
                        msg: err.message,
                        data: null
                    });
                }
                //   else if (res.rows.length === 0) {
                //     resolve({
                //       status: 404,
                //       msg: "The promotion with the specified ID does not exist",
                //       data: null
                //     });
                //   } 
                else {
                    // Nếu sản phẩm tồn tại, thực hiện load lên
                    //console.log(res.rows.length);
                    resolve({
                        status: 200,
                        msg: "Get all promotion successfully",
                        data: res.rows
                    });
                }
            });
        });
    }

    async apply(body){
        return new Promise( async (resolve, reject) => {
            // cấu trúc body
            /*
                uid:
                product:[{product_id, quantity},{product_id, quantity}]
                promotion_id có hoặc ko 
            */
            /*
                res:
                product:[{product_id, old_subtotal, new_subtotal},{product_id, old_subtotal, new_subtotal}]
                old_total:
                new_total:
            */
            /*
                lấy giá sản phẩm từ bảng product
                => old_sub > min ?
                xét loại áp dụng 
                - all:
                    + new_subtotal = old_subtotal
                    + old_total = tổng sigma (old_subtotal) > minspent ? tính tiếp : trả về old = new
                    + new_total = áp dụng khuyến mãi vào per/val max_amount
                - cate: chọn product có cate_id phù hợp
                    + xét xem sản phẩm trong product thuộc cate đó ko ? nếu có thì áp dụng khuyến mãi vào per/val max/min
                    + new_total = tổng sigma (new_sub)
                - product:
                    + 
            */
                // const x = [123,445]
                // x.length
                // var promoflag = true
                // if(!('promotion_id' in body)) promoflag = false;
            try{
                var promotion = null

                if('promotion_id' in body) promotion  = await client.query(`SELECT * FROM promotion WHERE promotion_id = $1`,[body.promotion_id])

                const products = body.product
                let productDetails = [];
                let oldTotal = 0;
                let newTotal = 0;

                let order_quantity = 0
                for(let i = 0; i < products.length; i++){
                    console.log("check2")
                    const result = await client.query(`SELECT * FROM product WHERE product_id = $1`,[products[i].product_id]);
                    if (result.rows.length === 0) {
                        return reject({
                            status: 404,
                            msg: `Product with ID ${products[i].product_id} not found`,
                            data: null
                        });
                    }

                    const productPrice  = result.rows[0].price;
                    const oldSubtotal   = productPrice * products[i].quantity;
                    order_quantity      +=products[i].quantity;
                    let newSubtotal     = oldSubtotal; // Nếu không có khuyến mãi, old = new
    
                    productDetails.push({
                        product_id:     products[i].product_id,
                        quantity:      products[i].quantity,
                        old_subtotal:   oldSubtotal,
                        new_subtotal:   newSubtotal
                    });
    
                    oldTotal += oldSubtotal;
                }
                newTotal = oldTotal
                // console.log(promotion)

                if( (!('promotion_id' in body)) || ( oldTotal < promotion.rows[0].minspent) ) {
                    // không có mã hoặc đơn không đủ minspent
                    let tmpobj = {
                        product:    productDetails,
                        old_total:  oldTotal,
                        new_total:  newTotal
                    }

                    resolve({
                        status: 200,
                        msg:    "No promotion to apply",
                        data:   tmpobj
                    });
                }

                const range     = promotion.rows[0].apply_range
                var max_amount  = promotion.rows[0].max_amount
                const type      = promotion.rows[0].discount_type

                if (range === "product"){
                    const index = productDetails.findIndex( product => product.product_id === promotion.rows[0].apply_id );
                    if (index !== -1){
                        var product = productDetails[index]
                        // console.log(product)
                        var subtotal= product.new_subtotal 
                        let dis_val = 0
                        if (type === "fix price"){
                            dis_val = promotion.rows[0].value * body.product[index].quantity
                        } else {// percentage
                            var percent = promotion.rows[0].percentage
                            dis_val = product.new_subtotal*(percent/100) // tính giá trị giảm trên đơn
                        }  
    
                        dis_val     = Math.min(max_amount, dis_val) // so sánh với max_amount
                        subtotal    -= dis_val // tính lại new_sub
                        subtotal    = Math.max(0, subtotal) // hanlde nếu trừ hết
                        productDetails[index].new_subtotal = subtotal // cập nhật lại newsubtotal cho sản phẩm
                        newTotal    = oldTotal - (productDetails[index].old_subtotal - subtotal)
                    }
                }else if(range === "category"){ // chỉ tính trừ trên đơn hàng không ghi vào sản phẩm
                    // const index = productDetails.findIndex( product => product.product_id === promotion.rows[0].apply_id );
                    const cate = await client.query(`SELECT product_id FROM product WHERE cate_id = $1`,[promotion.rows[0].apply_id]);
                    if (cate.rows.length === 0) {
                        resolve({
                            status: 404,
                            msg: "Have no product correspond to category",
                            data: null
                        });
                    } 
                    // console.log(cate)
                    let product_ids = cate.rows // mảng chứa product_id thuộc cate mà promotion áp dụng
                    let index_arr = []
                    let sum_old_total   = 0;
                    let sum_quantity    = 0;

                    for(let i = 0; i < productDetails.length;i++){
                        var targetId = productDetails[i].product_id
                        const exists = product_ids.some(product => product.product_id === targetId);// check xem sp có thuộc cate đó ko ?
                        
                        if(exists){
                            index_arr.push(i)
                            sum_old_total   += productDetails[i].old_subtotal
                            sum_quantity    += body.product[i].quantity
                        }
                    }
                    // var product = productDetails[index]
                    // console.log(product)
                    // var newtotal= productDetails.new_total 
                    let dis_val = 0
                    if (type === "fix price"){
                        dis_val = promotion.rows[0].value * sum_quantity
                    } else {
                        var percent = promotion.rows[0].percentage
                        dis_val     = sum_old_total*(percent/100) // tính giá trị giảm trên đơn
                    }
                    dis_val     = Math.min(max_amount, dis_val) // so sánh với max_amount
                    newTotal    -= dis_val // tính lại new_total
                    newTotal    = Math.max(0, newTotal) // hanlde nếu trừ hết
                    // productDetails[index].new_subtotal = subtotal // cập nhật lại newsubtotal cho sản phẩm
                }else { // all
                    let dis_val = 0
                    if (type === "fix price"){
                        // newTotal = oldTotal - 
                        dis_val = promotion.rows[0].value * order_quantity
                    }else {
                        var percent = promotion.rows[0].percentage
                        dis_val     = oldTotal*(percent/100) // tính giá trị giảm trên đơn
                    }
                    dis_val     = Math.min(max_amount, dis_val) // so sánh với max_amount
                    newTotal    -= dis_val // tính lại new_total
                    newTotal    = Math.max(0, newTotal) // hanlde nếu trừ hết
                } 

                // mình chưa tính lại cái newtotal

                let res_data = {
                    product:    productDetails,
                    old_total:  oldTotal,
                    new_total:  newTotal
                }
                console.log(res_data)
                resolve({
                    status: 200,
                    msg: "OK",
                    data: res_data
                });
            } catch (error){
                reject({
                    status: 500,
                    msg: error.message,
                    data: null
                });
            }
        });
    }
}

module.exports = new PromotionService;