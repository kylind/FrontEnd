var koa= require('koa');
var render = require('koa-ejs');

var app = koa();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

/*app.use(function *(){
    this.body = 'Hello World';
})*/
app.use(function*() {
  yield this.render('content');
});

app.listen(3000);




