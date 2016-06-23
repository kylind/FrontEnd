var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var operation = require('../data_access/address.js').collection

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

    var res = yield operation.queryAddresses()
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

router.get('/addresses/:client', function*() {

    var res = yield operation.queryAddresses({client: this.params.client})
    res = res && res.length > 0 ? res : [];

    this.body = res;
    this.status = 200;

});

router.post('/address', function*() {

    var address = this.request.body;

    yield operation.saveAddress(address)

    this.body = address;
    this.status = 200;

});


exports.router = router;
