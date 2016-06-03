var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var orderOperation = require('../data_access/order.js').collection

const RECEIVED='RECEIVED'

const EMPTY_ORDER = {
    _id: '',
    client: '',
    items: [{
        name: "",
        quantity: 1,
        note: '',
        isDone: false
    }],
    createDate: new Date(),
    status:RECEIVED
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

     order.items.forEach(function(item){
        item.quantity= +item.quantity;
        item.isDone = item.isDone == 'true'? true:false;
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

    res = yield orderOperation.query();

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

    res = yield orderOperation.queryPurchaseItems();

    console.log(res);

    res = res && res.length > 0 ? res : { warning: 'There is no purchase item.'};

    yield this.render('items', {
        items: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.post('/item/:itemName', function*() {

    var purchaseDetail = this.request.body;



    purchaseDetail.isDone = purchaseDetail.isDone == 'true'? true:false;

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


exports.router = router;
