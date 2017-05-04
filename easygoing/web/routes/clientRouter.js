var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var operation = require('../data_access/client.js').collection

var orderOperation = require('../data_access/order.js').collection

router = new Router();


router.post('/clients', function*() {

    var clientsData = this.request.body;

    var clients = clientsData.clients;

    yield operation.saveClients(clients)

    var res = yield operation.queryClients({ client: client })
    res = res && res.length > 0 ? res : [];

    this.body = res;
    this.status = 200;

});

router.get('/clients', function*() {

    var allClients = yield getClients();

    yield this.render('clients', {
        clients: allClients,
        css:'',
        name: 'mvvm',
        header: 'specific',
        footer: ''

    });

});

router.get('/clientsJson', function*() {

    var allClients = yield getClients();

    this.body = allClients;
    this.status = 200;

});

function* getClients() {
    var allClients = yield operation.queryClients()

    var receivedOrders = yield orderOperation.queryReceivedOrders();

    allClients = allClients && allClients.length > 0 ? allClients : [{
        _id: '',
        client: '',
        recipient: '',
        client: '',
        phone: ''
    }];

    allClients.forEach(function(client) {
        var client = client.client;

        var index = receivedOrders.findIndex(function(order) {
            return order.client == client ? true : false;
        });

        if (index >= 0) {
            client.isSend = true;

        } else {
            client.isSend = false;
        }

    });

    allClients = allClients.sort(function(a, b) {
        if (a.isSend) {
            return -1;
        } else if (b.isSend) {
            return 1;
        } else {
            return 0;
        }
    });

    return allClients;
}

router.get('/clientsByClient', function*() {

    var req = this.request.query;

    var client = req.client;

    var res = yield operation.queryClients({ client: client })
    res = res && res.length > 0 ? res : [];

    this.body = res;
    this.status = 200;

});

router.post('/client', function*() {

    var client = this.request.body;

    var isSend = client.isSend;

    delete client.isSend;

    yield operation.saveClient(client)

    client.isSend = isSend;

    this.body = client;
    this.status = 200;

});

router.delete('/client/:id', function*() {
    var id = this.params.id;

    var res = yield operation.removeById(id);
    this.body = res;
    this.status = 200;

});


exports.router = router;
