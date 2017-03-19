var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var Collection = require('../data_access/order.js').Collection;
var util = require('./util.js').util;

var dateFormatting = {
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
};

var RATE = 0.9;


const RECEIVED = '1RECEIVED';

const EMPTY_ORDER = {
    _id: '',
    client: '',
    postage: '',
    items: [],
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

var orderOperation;

router = new Router();

router.use(function*(next) {

    if (this.isAuthenticated()) {
        orderOperation = new Collection(this.req.user.collection);
        RATE = this.req.user.rate || 0.9;
    }

    yield next

})

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
        name: 'mvvm',
        header: 'specific',
        footer: ''
    });

});



router.post('/order', function*() {

    var order = this.request.body;

    util.processOrder(order);

    yield orderOperation.save([order]);

    order.displayDate = order.createDate ? order.createDate.toLocaleDateString("en-US", dateFormatting) : '';

    this.body = order;
    this.status = 200;

});

router.post('/orders', function*() {

    var req = this.request.body;

    var orders = req.orders;

    if (Array.isArray(orders) && orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {

            util.processOrder(orders[i]);
        }

        yield orderOperation.save(orders);

        orders.forEach(function(order) {

            order.displayDate = order.createDate ? order.createDate.toLocaleDateString("en-US", dateFormatting) : '';
        })


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

    var model = {
        name: 'index',
        css: 'swiper',
        header: 'specific',
        footer: '',
        _id: '',
        user:null,
        orders:[]
    }

    if (this.isAuthenticated()) {
        model.user = this.req.user;
        model._id = this.req.user._id;

        var res = yield orderOperation.queryReceivedOrders();
        model.orders = res && res.length > 0 ? res : [];
    }

    yield this.render('index', model);

});

router.get('/content', function*() {

    var model = {
        name: 'login',
        css: 'swiper',
        header: 'specific',
        footer: '',
        _id: '',
        user:null,
        orders:[],
        layout:'bare'
    }

    if (this.isAuthenticated()) {
        model.name='content';
        model.user = this.req.user;
        model._id = this.req.user._id;

        var res = yield orderOperation.queryReceivedOrders();
        model.orders = res && res.length > 0 ? res : [];

        yield this.render('content', model);

    }else{

        yield this.render('login', model);

    }


});



router.get('/receivedOrders', function*() {


    var res = yield orderOperation.queryReceivedOrders();
    res = res && res.length > 0 ? res : [];

    yield this.render('receivedOrders', {
        orders: res,
        css: '',
        name: 'mvvm',
        header: 'specific',
        footer: ''

    });

});
router.get('/receivedOrdersJson', function*() {


    var res = yield orderOperation.queryReceivedOrders();
    res = res && res.length > 0 ? res : [];

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
        order.displayDate = order.createDate ? new Date(order.createDate).toLocaleDateString("en-US", dateFormatting) : '';
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
        name: 'mvvm',
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
    var formatting = {
        month: "2-digit",
        day: "2-digit"
    };
    var total = { income: 0, revenue: 0, cost: 0, year: '', week: '', firstDate: '', lastDate: '' };
    if (Array.isArray(res)) {
        res.forEach(function(item) {
            item.firstDate = item.firstDate ? new Date(item.firstDate).toLocaleDateString("en-US", formatting) : '';
            item.lastDate = item.lastDate ? new Date(item.lastDate).toLocaleDateString("en-US", formatting) : '';
            total.income += item.income;
            total.revenue += item.revenue;
            total.cost += item.cost;
        });
        res.push(total);
    }

    yield this.render('incomeList', {
        profitList: res,
        css: '',
        name: 'mvvm',
        header: 'specific',
        footer: ''

    });

});
router.get('/incomeListJson', function*() {

    var res = yield orderOperation.summarizeProfit();
    var formatting = {
        month: "2-digit",
        day: "2-digit"
    }

    var total = { income: 0, revenue: 0, cost: 0, year: '', week: '', firstDate: '', lastDate: '' };
    if (Array.isArray(res)) {
        res.forEach(function(item) {
            item.firstDate = item.firstDate ? new Date(item.firstDate).toLocaleDateString("en-US", formatting) : '';
            item.lastDate = item.lastDate ? new Date(item.lastDate).toLocaleDateString("en-US", formatting) : '';
            total.income += item.income;
            total.revenue += item.revenue;
            total.cost += item.cost;


        });

        res.push(total);
    }

    this.body = res;
    this.status = 200;

});

function* getReckoningOrders() {
    var res = null;
    res = yield orderOperation.queryReckoningOrders();
    res = res && res.length > 0 ? res : [];

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

    var options = { year: "2-digit", month: "2-digit", day: "2-digit" };

    res.forEach(function(item) {
        item.createDate = new Date(item.createDate).toLocaleDateString("en-US", options);

    });

    this.body = res;
    this.status = 200;

});





exports.router = router;


var s = [{ "firstDate": "10/24", "lastDate": "10/30", "cost": 14393, "revenue": 18800, "income": 6278.09, "year": 2016, "week": 43 }, { "firstDate": "10/22", "lastDate": "10/23", "cost": 10378, "revenue": 12330, "income": 3322.8900000000003, "year": 2016, "week": 42 }, { "firstDate": "10/13", "lastDate": "10/16", "cost": 17834, "revenue": 22218, "income": 6702.419999999998, "year": 2016, "week": 41 }, { "firstDate": "10/06", "lastDate": "10/09", "cost": 12749, "revenue": 16157, "income": 5155.85, "year": 2016, "week": 40 }, { "firstDate": "09/26", "lastDate": "09/29", "cost": 646, "revenue": 732, "income": 169.98, "year": 2016, "week": 39 }, { "firstDate": "09/23", "lastDate": "09/25", "cost": 22526, "revenue": 28660, "income": 9062.38, "year": 2016, "week": 38 }, { "firstDate": "09/17", "lastDate": "09/17", "cost": 7015, "revenue": 8550, "income": 2352.95, "year": 2016, "week": 37 }, { "firstDate": "09/05", "lastDate": "09/11", "cost": 8559, "revenue": 10895, "income": 3449.070000000001, "year": 2016, "week": 36 }, { "firstDate": "08/29", "lastDate": "09/04", "cost": 27474, "revenue": 32276, "income": 8648.36, "year": 2016, "week": 35 }, { "firstDate": "08/28", "lastDate": "08/28", "cost": 10658, "revenue": 13690, "income": 3879.120000000001, "year": 2016, "week": 34 }, { "firstDate": "08/16", "lastDate": "08/21", "cost": 14136, "revenue": 17542, "income": 5233.4800000000005, "year": 2016, "week": 33 }, { "firstDate": "08/13", "lastDate": "08/14", "cost": 7254, "revenue": 9021, "income": 2782.5600000000004, "year": 2016, "week": 32 }, { "firstDate": "08/04", "lastDate": "08/07", "cost": 11258, "revenue": 14324, "income": 4754.699999999999, "year": 2016, "week": 31 }, { "income": 61791.85, "revenue": 205195, "cost": 164880, "year": "", "week": "", "firstDate": "", "lastDate": "" }]
