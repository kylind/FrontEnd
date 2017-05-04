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
        css: '',
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

    var receivedOrders = yield orderOperation.queryPrintedOrders();



    var activeClients = receivedOrders.map(function(order) {

        var index = allClients.findIndex(function(client) {
            return order.client == client.name;
        });

        if (index<0) {
            return { name: order.client,isActive:true, addresses: [{ recipient: '', phone: '', address: '' ,isActive:true}] }

        }else{

            let client= allClients[index];

            allClients.splice(index,1);
            return client;
        }

    });

    var clients=activeClients.concat(allClients);


    return clients;
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
