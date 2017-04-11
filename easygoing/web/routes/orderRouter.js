var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var Collection = require('../data_access/order.js').Collection;
var ProductCollection = require('../data_access/product.js').Collection;
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
        productOperation = new ProductCollection(this.req.user.productCollection);
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

router.post('/products', function*() {

    var req = this.request.body;

    var products = req.products;

    if (Array.isArray(products) && products.length > 0) {
        for (var i = 0; i < products.length; i++) {

            util.processProduct(products[i]);
        }

        yield productOperation.save(products);

        products.forEach(function(order) {

            product.displayDate = product.modifiedDate ? product.modifiedDate.toLocaleDateString("en-US", dateFormatting) : '';
        })

    }

    this.body = products;
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
router.delete('/product/:id', function*() {
    var id = this.params.id;

    var res = yield productOperation.remove(id);
    this.body = res;
    this.status = 200;

});

router.get('/index', function*() {

    var model = {
        name: 'index',
        css: 'swiper',
        header: 'specific',
        footer: 'login',
        _id: '',
        user:null,
        orders:[],
        needMask:false
    }

    if (this.isAuthenticated()) {
        model.user = this.req.user;
        model._id = this.req.user._id;
        model.footer='common';

        var res = yield orderOperation.queryReceivedOrders();
        model.orders = res && res.length > 0 ? res : [];
        model.needMask=true;
    }
    yield this.render('index', model);
});

router.get('/products', function*() {

    var res = yield productCollection.queryProducts();

    var model = {
        name: 'products',
        css: '',
        header: '',
        footer: '',
        products:res && res.length > 0 ? res : [],
        needMask:false
    }

    yield this.render('products', model);
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

router.get('/loading', function*() {


    var res = yield orderOperation.queryReceivedOrders();
    res = res && res.length > 0 ? res : [];

    yield this.render('loading', {
        css: '',
        name: 'loading',
        header: 'specific',
        footer: '',
        layout:false

    });

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

