const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const orderRoute = require('./order.route');
const categoryRoute = require('./category.route');
const promotionRoute = require('./promotion.route');
const paymentRoute = require('./payment.route');




function route(app) {
    app.use('/api/user', authRoute);
    app.use('/api/product', productRoute);
    app.use('/api/order', orderRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/promotion', promotionRoute);
    app.use('/api/payment', paymentRoute);
}

module.exports = route;
