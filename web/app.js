var koa = require('koa');
var path = require('path');
var render = require('koa-ejs');
var router = require('./routes/router.js').router;
var bodyParser = require('koa-bodyparser');

var app = koa();


render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);
