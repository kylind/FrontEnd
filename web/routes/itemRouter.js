var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var itemOperation = require('../data_access/item.js').collection



router = new Router();


router.get('/items', function*() {

    var res = null;

    res = yield itemOperation.queryItems();

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

    var updatedRes = yield itemOperation.updateItemStatus(this.params.itemName, purchaseDetail.isDone);

    var res = yield itemOperation.queryItemStatus(this.params.itemName);

    this.body = res[0];
    this.status = 200;

});

router.get('/subitems/:itemName', function*() {

    var itemName = this.params.itemName;

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
