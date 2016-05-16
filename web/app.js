var koa = require('koa');

var render = require('koa-ejs');
var router = require('./routes/router.js').router;


var path = require('path');



var app = koa();


render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});

/*app.use(function *(){
    this.body = 'Hello World';
})*/
app.use(router.routes());

app.listen(3000);
