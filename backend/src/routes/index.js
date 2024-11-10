const authRoute = require('./auth.route');

function route(app){
    app.use('/users', authRoute);
}

module.exports = route;
