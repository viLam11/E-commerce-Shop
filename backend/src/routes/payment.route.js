const express = require('express');
const router = express.Router();
const axios = require('axios')
const crypto = require('crypto')

// const dotenv = require('dotenv');
// dotenv.config()
router.use(express.json());
router.use(express.urlencoded({ extended: true }))

//phải tải momo sandbox về mới xài được -> có trong trang momo developer

router.post('/config', async (req, res) => {
    const { oid, final_price } = req.body
    // return res.status(200).json({
    //     status: 200,
    //     data: process.env.CLIENT_ID
    // })

    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:5173/user/info/notification'; //link chuyển hướng đến trang mong muốn
    var ipnUrl = 'https://1a62-116-110-40-231.ngrok-free.app/api/payment/callback'; //chú ý: cần dùng ngrok thì momo mới post đến url này được 
    //(mở cmd với lệnh "ngrok http <PORT cần gọi phía backend>"), cần cài ngrok trước khi sdung lệnh
    //lấy link từ Forwarding ./callback
    var requestType = "payWithMethod";
    var amount = final_price;
    var orderId = oid;
    var requestId = orderId;
    var extraData = '';
    //var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });

    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    let result;
    try {
        result = await axios(options)
        return res.status(200).json(result.data)
    } catch (err) {
        return res.status(500).json({
            status: 500,
            msg: "server error"
        })
    }

});

router.post('/callback', async (req, res) => {
    /**
      resultCode = 0: giao dịch thành công.
      resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
      resultCode <> 0: giao dịch thất bại.
     */
    console.log('callback: ');
    console.log(req.body);
    /**
     * Dựa vào kết quả này để update trạng thái đơn hàng
     * Kết quả log:
     * {
          partnerCode: 'MOMO',
          orderId: 'MOMO1712108682648',
          requestId: 'MOMO1712108682648',
          amount: 10000,
          orderInfo: 'pay with MoMo',
          orderType: 'momo_wallet',
          transId: 4014083433,
          resultCode: 0,
          message: 'Thành công.',
          payType: 'qr',
          responseTime: 1712108811069,
          extraData: '',
          signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
        }
     */

    return res.status(204).json(req.body);
});

router.post('/check-status-transaction', async (req, res) => {
    const { orderId } = req.body;

    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var accessKey = 'F8BBA842ECF85';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: 'MOMO',
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: 'vi',
    });

    // options for axios
    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/query',
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestBody,
    };

    const result = await axios(options);

    return res.status(200).json(result.data);
});

//const axios = require('axios').default; // npm install axios
// const CryptoJS = require('crypto-js'); // npm install crypto-js
// const moment = require('moment'); // npm install moment
// const bodyParser = require('body-parser');

// // APP INFO
// const config = {
//     app_id: "2553",
//     key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
//     key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
//     endpoint: "https://sb-openapi.zalopay.vn/v2/create"
// };

// router.post('/paymentZalopay', async (req, res) => {
//     const embed_data = {
//         redirectUrl: "https://google.com"
//     };

//     const items = [{}];
//     const transID = Math.floor(Math.random() * 1000000);
//     const order = {
//         app_id: config.app_id,
//         app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
//         app_user: "user123",
//         app_time: Date.now(), // miliseconds
//         item: JSON.stringify(items),
//         embed_data: JSON.stringify(embed_data),
//         amount: 50000,
//         description: `Lazada - Payment for the order #${transID}`,
//         bank_code: "",
//     };

//     // appid|app_trans_id|appuser|amount|apptime|embeddata|item
//     const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
//     order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
//     try {
//         result = await axios.post(config.endpoint, null, { params: order })
//         console.log(result.data)
//     } catch (err) { console.log(err.message) }
// })

// router.post('/callback', (req, res) => {
//     let result = {};

//     try {
//         let dataStr = req.body.data;
//         let reqMac = req.body.mac;

//         let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
//         console.log("mac =", mac);


//         // kiểm tra callback hợp lệ (đến từ ZaloPay server)
//         if (reqMac !== mac) {
//             // callback không hợp lệ
//             result.return_code = -1;
//             result.return_message = "mac not equal";
//         }
//         else {
//             // thanh toán thành công
//             // merchant cập nhật trạng thái cho đơn hàng
//             let dataJson = JSON.parse(dataStr, config.key2);
//             console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

//             result.return_code = 1;
//             result.return_message = "success";
//         }
//     } catch (ex) {
//         result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
//         result.return_message = ex.message;
//     }

//     // thông báo kết quả cho ZaloPay server
//     res.json(result);
// });

module.exports = router;