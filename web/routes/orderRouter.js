var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var orderOperation = require('../data_access/order.js').collection


const RECEIVED = 'RECEIVED'

const EMPTY_ORDER = {
    _id: '',
    client: '',
    items: [{
        name: "",
        quantity: 1,
        note: '',
        buyPrice: '',
        sellPrice: '',
        isDone: false
    }],
    addresses: [{
        _id: '',
        client: '',
        recipient: '',
        address: '',
        phone: ''
    }],
    createDate: new Date(),
    status: RECEIVED
}

router = new Router();

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

    order.items.forEach(function(item) {
        item.quantity = +item.quantity;
        item.isDone = item.isDone == 'true' ? true : false;
        item.buyPrice = item.buyPrice ? +item.buyPrice : null;
        item.sellPrice = item.sellPrice ? +item.sellPrice : null;
    });

    if (ObjectID.isValid(order._id)) {

        console.log('valid id:' + order._id);

        res = yield orderOperation.updateById(order._id, order);


    } else {

        console.log('no valid id:' + order._id);
        delete order._id
        res = yield orderOperation.insert(order);
    }

    this.body = order;
    this.status = 200;

});

router.delete('/order/:id', function*() {
    var id = this.params.id;

    var res = yield orderOperation.remove(id);
    this.body = res;
    this.status = 200;

});

router.get('/orders', function*() {

    yield this.render('orders', {
        orders: [EMPTY_ORDER],
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.get('/orders/abc', function*() {

    var res = null;

    res = yield orderOperation.queryOrders();

    res = res && res.length > 0 ? res : [EMPTY_ORDER];

    yield this.render('orders', {
        orders: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});


router.get('/reckoning', function*() {

    var res = null;
    res = yield orderOperation.queryReckoningOrders();
    res = res && res.length > 0 ? res : [EMPTY_ORDER];


    res.forEach(function(item) {
        if (Array.isArray(item.addresses) && item.addresses.length > 0);
        else {

            item.addresses = [{
                _id: '',
                client: item.client,
                recipient: '',
                address: '',
                phone: ''
            }];
        }
    });

    console.log(res);

    yield this.render('reckoning', {
        orders: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});


router.get('/historictrades/:itemName', function*() {

    var itemName = this.params.itemName;

    var res = yield orderOperation.getHistoricTrades(itemName);

    var options = {year: "2-digit", month: "2-digit", day: "numeric"};

    res.forEach(function(item) {
        item.createDate = new Date(item.createDate).toLocaleDateString("en-US", options);

    });

    this.body = res;
    this.status = 200;

});

exports.router = router;
