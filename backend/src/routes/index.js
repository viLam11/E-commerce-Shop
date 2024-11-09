const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const orderRoute = require('./order.route');



function route(app) {
    app.use('/api/user', authRoute);
    app.use('/api/product', productRoute);
    app.use('/api/order', orderRoute);

    
    app.get("/", (req, res, next) => {
        res.send("Success connect BE");
    })
}

module.exports = route;
