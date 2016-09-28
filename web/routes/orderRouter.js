var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var orderOperation = require('../data_access/order.js').collection;
var util = require('./util.js').util;

var dateFormatting = {
    month: "2-digit",
    day: "numeric",
    weekday: "short"
};

const RATE = 0.87;


const RECEIVED = '1RECEIVED'

const EMPTY_ORDER = {
    _id: '',
    client: '',
    postage: '',
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
        css: '',
        script: 'mvvm',
        header: 'specific',
        footer: ''
    });

});

function* saveOrder(order) {
    var res;

    order.items=order.items.filter(function(item){
        return item.name==''? false : true;
    })

    order.items.forEach(function(item) {
        item.quantity = +item.quantity;
        item.isDone = item.isDone == 'true' ? true : false;
        item.buyPrice = item.buyPrice ? +item.buyPrice : null;
        item.sellPrice = item.sellPrice ? +item.sellPrice : null;
        delete item.profit;
        delete item.isChanged;
    });

    delete order.displayDate;
    delete order.total;
    delete order.orderStatus;
    delete order.orderPackingStatus;
    delete order.orderReadyStatus;
    delete order.isChanged;
    delete order.__ko_mapping__;


    if (ObjectID.isValid(order._id)) {

        console.log('valid id:' + order._id);

        order.createDate = new Date(order.createDate);
        order.rate = +order.rate;
        util.sumarizeOrder(order);

        res = yield orderOperation.updateById(order._id, order);

    } else {

        console.log('no valid id:' + order._id);
        delete order._id

        order.createDate = new Date();
        order.rate = RATE;
        util.sumarizeOrder(order);

        res = yield orderOperation.insert(order);

    }

    order.displayDate = order.createDate ? order.createDate.toLocaleDateString("en-US", dateFormatting) : '';

    return order;
}

router.post('/order', function*() {

    var order = this.request.body;

    yield saveOrder(order);

    this.body = order;
    this.status = 200;

});

router.post('/orders', function*() {

    var req = this.request.body;

    var orders=req.orders;

    if(Array.isArray(orders) && orders.length>0){
        for(var i=0;i<orders.length;i++){
            yield saveOrder(orders[i]);
        }

    }


    this.body = orders;
    this.status = 200;

});

router.put('/orderStatus/:id', function*() {

    var orderStatus = this.request.body;
    var res;

    res = yield orderOperation.updateOrderStatus(this.params.id, orderStatus.status);

    this.body = res;
    this.status = 200;

});

router.put('/packingStatus/:id', function*() {

    var packingStatus = this.request.body;
    var res;

    res = yield orderOperation.updatePackingStatus(this.params.id, packingStatus.packingStatus);

    this.body = res;
    this.status = 200;

});

router.delete('/order/:id', function*() {
    var id = this.params.id;

    var res = yield orderOperation.remove(id);
    this.body = res;
    this.status = 200;

});

router.get('/index', function*() {


    var res = yield orderOperation.queryReceivedOrders();
    res = res && res.length > 0 ? res : [EMPTY_ORDER];

    yield this.render('index', {
        orders: res,
        script: '',
        css: 'swiper',
        header: 'specific',
        footer: ''

    });

});

router.get('/receivedOrders', function*() {


    var res = yield orderOperation.queryReceivedOrders();
    res = res && res.length > 0 ? res : [EMPTY_ORDER];

    yield this.render('receivedOrders', {
        orders: res,
        css: '',
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});
router.get('/receivedOrdersJson', function*() {


    var res = yield orderOperation.queryReceivedOrders();
    res = res && res.length > 0 ? res : [EMPTY_ORDER];

    this.body = res;
    this.status = 200;

});

router.get('/ordersByName', function*() {

    var req = this.request.query;

    var client = req.client;

    var res = null;

    res = yield orderOperation.queryGlobalOrders(client);

    res = res && res.length > 0 ? res : [];


    res.forEach(function(order) {

        order.rate = order.rate ? order.rate : RATE;

        //util.sumarizeOrder(order);

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

    this.body = res;
    this.status = 200;

});


router.get('/reckoningOrders', function*() {

    var res = yield getReckoningOrders();

    yield this.render('reckoningOrders', {
        orders: res,
        css: '',
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});
router.get('/reckoningOrdersJson', function*() {

    var res = yield getReckoningOrders();

    this.body = res;
    this.status = 200;

});
router.get('/incomeList', function*() {

    var res = yield orderOperation.summarizeProfit();

    yield this.render('incomeList', {
        profitList: res,
        css: '',
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});
router.get('/incomeListJson', function*() {

    var res = yield orderOperation.summarizeProfit();

    this.body = res;
    this.status = 200;

});

function* getReckoningOrders() {
    var res = null;
    res = yield orderOperation.queryReckoningOrders();
    res = res && res.length > 0 ? res : [EMPTY_ORDER];

    res.forEach(function(order) {

        order.rate = order.rate ? order.rate : RATE;

        order.displayDate = order.createDate ? new Date(order.createDate).toLocaleDateString("en-US", dateFormatting) : '';

        //util.sumarizeOrder(order);

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

    return res;
}

router.get('/historictrades', function*() {

    var req = this.request.query;

    var itemName = req.itemName;

    var res = yield orderOperation.getHistoricTrades(itemName);

    var options = { year: "2-digit", month: "2-digit", day: "numeric" };

    res.forEach(function(item) {
        item.createDate = new Date(item.createDate).toLocaleDateString("en-US", options);

    });

    this.body = res;
    this.status = 200;

});





exports.router = router;
