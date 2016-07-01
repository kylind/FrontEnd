var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var orderOperation = require('../data_access/order.js').collection;
var util = require('./util.js').util;

const RATE = 0.85;


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
    createDate: '',
    rate: RATE,
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
        delete item.profit;
    });



    delete order.sellPrice;
    delete order.buyPrice;
    delete order.profit;

    if (ObjectID.isValid(order._id)) {

        console.log('valid id:' + order._id);

        order.createDate = new Date(order.createDate);
        order.rate = +order.rate;

        res = yield orderOperation.updateById(order._id, order);


    } else {

        console.log('no valid id:' + order._id);
        delete order._id

        order.createDate = new Date();
        order.rate = RATE;
        res = yield orderOperation.insert(order);
    }

    util.sumarizeOrder(order);



    this.body = order;
    this.status = 200;

});

router.put('/orderStatus/:id', function*() {

    var orderStatus = this.request.body;
    var res;

    res = yield orderOperation.updateOrderStatus(this.params.id, orderStatus.status);

    this.body = res;
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

router.get('/ordersByName', function*() {

    var req = this.request.body;

    var client = req.client;

    var res = null;

    res = yield orderOperation.queryOrders({ client: client });

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



    res.forEach(function(order) {

        order.rate = order.rate ? order.rate : RATE;

        util.sumarizeOrder(order);

        if (Array.isArray(order.addresses) && order.addresses.length > 0);
        else {

            order.addresses = [{
                _id: '',
                client: order.client,
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

    var options = { year: "2-digit", month: "2-digit", day: "numeric" };

    res.forEach(function(item) {
        item.createDate = new Date(item.createDate).toLocaleDateString("en-US", options);

    });

    this.body = res;
    this.status = 200;

});

exports.router = router;
