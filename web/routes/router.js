var Router = require('koa-router');
var db = require('../data_access/order.js')


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
    yield this.render('content', {
        product: product
    });

});

router.get('/orders', function*(next) {


    yield this.render('order');

});


router.post('/orders/', function* (next) {

    var order = this.request.body;
    db.insert(order);

    yield next;

});


exports.router = router;

