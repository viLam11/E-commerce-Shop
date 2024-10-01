const authRoute = require('./auth.route');

function route(app){
    app.use('/', authRoute);
}

module.exports = route;
