var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var operation = require('../data_access/address.js').collection

var orderOperation = require('../data_access/order.js').collection

router = new Router();


router.post('/addresses', function*() {

    var addressesData = this.request.body;

    var addresses = addressesData.addresses;

    var removedAddresses = addressesData.removedAddresses;

    var client = addressesData.client;

    yield operation.saveAddresses(client, addresses,removedAddresses)

    var res = yield operation.queryAddresses({client: client})
    res = res && res.length > 0 ? res : [];

    this.body = res;
    this.status = 200;

});

router.get('/addresses', function*() {

    var allAddresses = yield operation.queryAddresses()

    var receivedOrders =  yield orderOperation.queryReceivedOrders();

    allAddresses = allAddresses && allAddresses.length > 0 ? allAddresses : [{
        _id: '',
        client: '',
        recipient: '',
        address: '',
        phone: ''
    }];

    allAddresses.forEach(function(address){
        var client= address.client;

        var index=receivedOrders.findIndex(function(order){
            return order.client==client ? true: false;
        });

        if(index>=0){
            address.isSend=true;

        }else{
            address.isSend=false;
        }

    });

    allAddresses=allAddresses.sort(function(a,b){
        if(a.isSend){
            return -1;
        }else if(b.isSend){
            return 1;
        }else{
            return 0;
        }
    })


    yield this.render('addresses', {
        addresses: allAddresses,
        script: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.get('/addressesByClient', function*() {

    var req = this.request.query;

    var client = req.client;

    var res = yield operation.queryAddresses({client: client})
    res = res && res.length > 0 ? res : [];

    this.body = res;
    this.status = 200;

});

router.post('/address', function*() {

    var address = this.request.body;

    var isSend=address.isSend;

    delete address.isSend;

    yield operation.saveAddress(address)

    address.isSend=isSend;

    this.body = address;
    this.status = 200;

});

router.delete('/address/:id', function*() {
    var id = this.params.id;

    var res = yield operation.removeById(id);
    this.body = res;
    this.status = 200;

});


exports.router = router;
