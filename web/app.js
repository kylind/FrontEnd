var koa = require('koa');
var path = require('path');
var render = require('koa-ejs');
var send = require('koa-send');

var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo');

var app = koa();
app.keys = ['keys', 'keykeys'];
app.use(session({
    store: new MongoStore({
        host:"120.24.63.42",
        db: "orders",
        user: "website",
        password: "zombie.123",
    })
}));


require('./routes/auth.js');
const passport = require('koa-passport')

app.use(passport.initialize());
app.use(passport.session());


render(app, {
    root: path.join(__dirname, 'views'),
    viewExt: 'html',
    cache: false,
    debug: true
});


app.use(function*(next) {

    console.log(`It's handled by process: ${process.pid}`);

    yield send(this, this.path, {
        root: __dirname + '/public'
    });

    console.log('static file');

    yield next;

});

var loginRouter = require('./routes/loginRouter.js').router;
var itemRouter = require('./routes/itemRouter.js').router;
var orderRouter = require('./routes/orderRouter.js').router;
var addressRouter = require('./routes/addressRouter.js').router;
var bodyParser = require('koa-bodyparser');

app.use(bodyParser());
app.use(loginRouter.routes());
app.use(orderRouter.routes());
app.use(itemRouter.routes());
app.use(addressRouter.routes());



app.listen(3000);

console.log(process.env.NODE_ENV);
console.log(process.env.db);
