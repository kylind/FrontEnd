var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var Collection = require('../data_access/item.js').Collection

var itemOperation;

router = new Router();

router.use(function*(next){

    itemOperation = new Collection(this.req.user.collection);
    yield next;

})

router.get('/purchaseItems', function*() {

    var items = yield itemOperation.queryItems();

    var markedItems = yield itemOperation.queryItemsByMark();

    items = Array.isArray(items) && items.length > 0 ? items : [];
    markedItems = Array.isArray(markedItems) && markedItems.length > 0 ? markedItems : [];

    yield this.render('purchaseItems', {
        items:{ items: items, markedItems: markedItems },
        css: '',
        name: 'mvvm',
        header: 'specific',
        footer: ''

    });

});



router.get('/purchaseItemsJson', function*() {

    var items = yield itemOperation.queryItems();

    var markedItems = yield itemOperation.queryItemsByMark();

    items = Array.isArray(items) && items.length > 0 ? items : [];
    markedItems = Array.isArray(markedItems) && markedItems.length > 0 ? markedItems : [];


    this.body = { items: items, markedItems: markedItems };
    this.status = 200;

});

router.get('/purchaseMarkedItemsJson', function*() {

    var res = yield itemOperation.queryItemsByMark();

    res = res && res.length > 0 ? res : [];

    this.body = res;
    this.status = 200;

});

router.post('/item', function*() {

    var purchaseDetail = this.request.body;

    var itemName = purchaseDetail.itemName;

    purchaseDetail.isDone = purchaseDetail.isDone == 'true' ? true : false;

    var updatedRes = yield itemOperation.updateItemStatus(itemName, purchaseDetail.isDone);

    var res = yield itemOperation.queryItemStatus(itemName);

    this.body = res[0];
    this.status = 200;

});

router.get('/subitems', function*() {

    var req = this.request.query;

    var itemName = req.itemName;

    var res = yield itemOperation.querySubItems(itemName);

    var dateFormatting = {
        month: "2-digit",
        day: "numeric",
        weekday: "short"
    };

    res.forEach(function(subItem) {

        subItem.createDate = subItem.createDate.toLocaleDateString("en-US", dateFormatting);

    })

    this.body = res;
    this.status = 200;

});

exports.router = router;
