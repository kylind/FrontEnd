var koa = require('koa');
var render = require('koa-ejs');
var path =require('path');

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
app.use(function*() {
    var product=[
            { name: 'a', price: 1 },
            { name: 'b', price: 2 },
            { name: 'c', price: 3 }
        ];
    yield this.render('content', {
        product: product
    });
});

app.listen(3000);
