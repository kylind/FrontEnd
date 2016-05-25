var Router = require('koa-router');
var orderOperation = require('../data_access/order.js').collection


router = new Router();
router.get('/testorders', function*(next) {

    var product = [{
        name: 'a',
        price: 11
    }, {
        name: 'b',
        price: 2
    }, {
        name: 'c',
        price: 3
    }];
    this.render('content', {
        product: product
    });

});

router.get('/order', function*() {


    yield this.render('order');

});


router.post('/order', function*() {
    console.log('insert order...');

    var order = this.request.body;

    var res = yield orderOperation.insert(order);


    this.body = res;
    this.status = 200;


    console.log('---res---' + res);


});


exports.router = router;
