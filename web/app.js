var koa = require('koa');
var path = require('path');
var render = require('koa-ejs');
var send = require('koa-send');
var fs = require('fs');

var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo');

var app = koa();
app.keys = ['keys', 'keykeys'];
app.use(session({
    store: new MongoStore({
        // host: "120.24.63.42",
        host:"127.0.0.1",
        db: "orders"
        // user: "website",
        // password: "zombie.123"
    }),
    cookie: {
        maxage: 604800000,
        overwrite:true
    }
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

    var rs = yield send(this, this.path, {
        root: __dirname + '/public'
    });

    var path = `${__dirname}/public${this.path}`;

    var isFile = false;

    try {
        isFile = fs.statSync(path).isFile();

    } catch (err) {}

    if (!isFile) {
        yield next;
    } else {
        console.log(`request static file: ${this.path}`);
    }

});

var bodyParser = require('koa-bodyparser');
var loginRouter = require('./routes/loginRouter.js').router;
app.use(bodyParser());
app.use(loginRouter.routes());

app.use(function*(next) {
    console.log(`authenticate: ${ this.path }`);
    if (this.isAuthenticated()) {
        yield next;
    } else {
        this.redirect('/')
    }
});


var itemRouter = require('./routes/itemRouter.js').router;
var orderRouter = require('./routes/orderRouter.js').router;
var addressRouter = require('./routes/addressRouter.js').router;
var otherRouter = require('./routes/otherRouter.js').router;

app.use(orderRouter.routes());
app.use(itemRouter.routes());
app.use(addressRouter.routes());
app.use(otherRouter.routes());

app.listen(3000);

console.log(process.env.NODE_ENV);
console.log(process.env.db);
