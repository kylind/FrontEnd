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
    yield this.render('content', {
        product: product
    });

});

router.get('/order/:id', function*() {
    var res = null;

    if (ObjectID.isValid(this.params.id)) {
        console.log('i am valid id');

        res = yield orderOperation.query({
            '_id': new ObjectID(this.params.id)
        });

    } else {
        console.log('i am not valid id');
        res = {
            _id: '',
            client: '',
            items: [{
                name: "",
                quantity: 1,
                note: ''
            }]
        }

    }

    yield this.render('order', {
        order: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''


    });

});

router.get('/order', function*() {

    var res = {
        _id: '',
        client: '',
        items: [{
            name: "",
            quantity: 1,
            note: ''
        }]
    }

    yield this.render('order', {
        order: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''


    });

});

router.post('/order', function*() {
    console.log('strat to handle request...');

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

    console.log('end to handle request...');


});


exports.router = router;
