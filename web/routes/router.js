var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var orderOperation = require('../data_access/order.js').collection

const EMPTY_ORDER = {
    _id: '',
    client: '',
    items: [{
        name: "",
        quantity: 1,
        note: ''
    }],
    createDate:'',
    status:'',
}

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

        res = yield orderOperation.query({
            '_id': new ObjectID(this.params.id)
        });

        res = res && res.length > 0 ? res[0] : EMPTY_ORDER;

    } else {
        res = EMPTY_ORDER;

    }

    yield this.render('order', {
        order: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''
    });

});

router.get('/order', function*() {



    yield this.render('order', {
        order: EMPTY_ORDER,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.post('/order', function*() {

    var order = this.request.body;
    var res;


    if (ObjectID.isValid(order._id)) {

        console.log('valid id:' + order._id);

        res = yield orderOperation.updateById(order._id, order);


    } else {
        console.log('no valid id:' + order._id);
        delete order._id
        res = yield orderOperation.insert(order);
    }


    console.log(order);


    this.body = order;
    this.status = 200;

});

router.get('/receiving', function*() {

    yield this.render('receiving', {
        orders: [EMPTY_ORDER],
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.get('/receiving/abc', function*() {

    var res = null;

    res = yield orderOperation.query();

    res = res && res.length > 0 ? res : [EMPTY_ORDER];

    yield this.render('receiving', {
        orders: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});


exports.router = router;
