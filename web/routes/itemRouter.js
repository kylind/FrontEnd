var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var itemOperation = require('../data_access/item.js').collection



router = new Router();
router.get('/purchaseItems', function*() {

    var res = yield itemOperation.queryItems();

    res = res && res.length > 0 ? res : { warning: 'There is no purchase item.' };

    yield this.render('purchaseItems', {
        items: res,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.get('/purchaseItemsJson', function*() {

    var res = yield itemOperation.queryItems();

    res = res && res.length > 0 ? res : { warning: 'There is no purchase item.' };

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

    res.forEach(function(subItem){

         subItem.createDate = subItem.createDate.toLocaleDateString("en-US", dateFormatting);

    })

    this.body = res;
    this.status = 200;

});

exports.router = router;
