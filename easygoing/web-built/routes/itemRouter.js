var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var Collection = require('../data_access/item.js').Collection

//var itemOperation;

router = new Router();

function getItemCollection(req) {

    return new Collection(req.user.collection, req.user.productCollection);

}

router.use(function* (next) {
    if (this.isAuthenticated()) {
        //itemOperation = new Collection(this.req.user.collection);
    }
    yield next;

})

router.get('/purchaseItems', function* () {

    let itemOperation = getItemCollection(this.req);

    var items = yield itemOperation.queryItems();

    var markedItems = yield itemOperation.queryItemsByMark();

    items = Array.isArray(items) && items.length > 0 ? items : [];
    markedItems = Array.isArray(markedItems) && markedItems.length > 0 ? markedItems : [];

    yield this.render('purchaseItems', {
        items: { items: items, markedItems: markedItems },
        css: '',
        name: 'mvvm',
        header: 'specific',
        footer: ''

    });

});



router.get('/purchaseItemsJson', function* () {

    let itemOperation = getItemCollection(this.req);

    var items = yield itemOperation.queryItems();

    var markedItems = yield itemOperation.queryItemsByMark();

    items = Array.isArray(items) && items.length > 0 ? items : [];
    markedItems = Array.isArray(markedItems) && markedItems.length > 0 ? markedItems : [];


    this.body = { items: items, markedItems: markedItems };
    this.status = 200;

});

router.get('/purchaseMarkedItemsJson', function* () {
    let itemOperation = getItemCollection(this.req);

    var res = yield itemOperation.queryItemsByMark();

    res = res && res.length > 0 ? res : [];

    this.body = res;
    this.status = 200;

});

router.post('/item', function* () {

    var purchaseDetail = this.request.body;

    var itemName = purchaseDetail.itemName;
    var itemTag = purchaseDetail.itemTag;

    purchaseDetail.isDone = purchaseDetail.isDone == 'true' ? true : false;

    let itemOperation = getItemCollection(this.req);

    var updatedRes = yield itemOperation.updateItemStatus(itemName, itemTag, purchaseDetail.isDone);

    var res = yield itemOperation.queryItemStatus(itemName, itemTag);

    this.body = res[0];
    this.status = 200;

});
router.post('/itemtag', function* () {

    var tagObj = this.request.body;

    var oldTag = tagObj.oldTag;
    var newTag = tagObj.newTag;
    var itemName = tagObj.itemName;

    let itemOperation = getItemCollection(this.req);


    yield itemOperation.updateItemTag(itemName, oldTag, newTag);


    this.body = { newTag: newTag };
    this.status = 200;

});

router.post('/subitem', function* () {

    var subItem = this.request.body;


    subItem.isDone = subItem.isDone == 'true' ? true : false;

    let itemOperation = getItemCollection(this.req);

    var updatedRes = yield itemOperation.updateSubItemStatus(subItem._id, subItem.name, subItem.isDone);

    var res = yield itemOperation.queryItemStatus(subItem.name, subItem.tag);

    this.body = Array.isArray(res) ? res[0] : res;
    this.status = 200;

});
router.get('/subitems', function* () {

    var req = this.request.query;

    var itemName = req.itemName;
    var itemTag = req.itemTag;

    let itemOperation = getItemCollection(this.req);

    var res = yield itemOperation.querySubItems(itemName, itemTag);

    var dateFormatting = {
        month: "2-digit",
        day: "numeric",
        weekday: "short"
    };

    res.forEach(function (subItem) {

        subItem.createDate = subItem.createDate.toLocaleDateString("en-US", dateFormatting);

    })

    this.body = res;
    this.status = 200;

});

exports.router = router;
