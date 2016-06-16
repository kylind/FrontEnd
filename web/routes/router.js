var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var orderOperation = require('../data_access/order.js').collection
var addressOperation = require('../data_access/address.js').collection

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
        item.buyPrice = item.buyPrice ? +item.buyPrice : 0;
        item.sellPrice = item.sellPrice ? +item.sellPrice : 0;
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

router.get('/items', function*() {

    var res = null;

    res = yield orderOperation.queryItems();

    console.log(res);

    res = res && res.length > 0 ? res : { warning: 'There is no purchase item.' };

    yield this.render('items', {
        items: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.post('/item/:itemName', function*() {

    var purchaseDetail = this.request.body;

    purchaseDetail.isDone = purchaseDetail.isDone == 'true' ? true : false;

    var updatedRes = yield orderOperation.updateItemStatus(this.params.itemName, purchaseDetail.isDone);

    var res = yield orderOperation.getItemStatus(this.params.itemName);

    this.body = res[0];
    this.status = 200;

});

router.get('/subitems/:itemName', function*() {

    var itemName = this.params.itemName;

    var res = yield orderOperation.getSubItems(itemName);

    this.body = res;
    this.status = 200;

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

router.post('/addresses', function*() {

    var addressesData = this.request.body;

    var addresses = addressesData.addresses;

    var client = addressesData.client;



    yield addressOperation.saveAddresses(client, addresses)

    this.body = addresses;
    this.status = 200;

});

router.post('/address', function*() {

    var address = this.request.body;

    yield addressOperation.saveAddress(address)

    this.body = address;
    this.status = 200;

});

router.get('/addresses', function*() {

    var res = yield addressOperation.queryAddresses()
    res = res && res.length > 0 ? res : [{
        _id: '',
        client: '',
        recipient: '',
        address: '',
        phone: ''
    }];

    yield this.render('addresses', {
        addresses: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.get('/historictrades/:itemName', function*() {

    var itemName = this.params.itemName;

    var res = yield orderOperation.getHistoricTrades(itemName);

    this.body = res;
    this.status = 200;

});

exports.router = router;
