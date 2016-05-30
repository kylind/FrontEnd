var koa = require('koa');
var path = require('path');
var render = require('koa-ejs');
var send = require('koa-send');
var router = require('./routes/router.js').router;

var bodyParser = require('koa-bodyparser');

var app = koa();


render(app, {
    root: path.join(__dirname, 'views'),
    viewExt: 'html',
    cache: false,
    debug: true
});

app.use(function*(next) {

    yield send(this, this.path, {
        root: __dirname + '/public'
    });

    console.log('static file');

    yield next;

});

app.use(bodyParser());

app.use(router.routes());



app.listen(3000);
