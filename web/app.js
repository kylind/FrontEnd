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
        db: "orders",
        user: "website",
        password: "zombie.123"
    })
}));



var itemRouter = require('./routes/itemRouter.js').router;
var orderRouter = require('./routes/orderRouter.js').router;
var addressRouter = require('./routes/addressRouter.js').router;
var bodyParser = require('koa-bodyparser');

var app = koa();


render(app, {
    root: path.join(__dirname, 'views'),
    viewExt: 'html',
    cache: false,
    debug: true
});

app.use(function*(next) {

    console.log(this.path);



    yield send(this, this.path, {
        root: __dirname + '/public'
    });

    console.log('static file');

    yield next;

});

app.use(bodyParser());

app.use(orderRouter.routes());
app.use(itemRouter.routes());
app.use(addressRouter.routes());



app.listen(3000);
