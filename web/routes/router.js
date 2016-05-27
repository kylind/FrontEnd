var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
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


router.post('/orders', function*() {
    console.log('insert order...');

    var order = this.request.body;
    var res;

    if (ObjectID.isValid(order._id)) {

        console.log('valid id:' + order._id);

        res = yield orderOperation.update(order);


    } else {
        console.log('no valid id:' + order._id);
        delete order._id
        res = yield orderOperation.insert(order);
    }



    console.log(order);


    this.body = order;
    this.status = 200;


    console.log('---res---' + res);


});


exports.router = router;
