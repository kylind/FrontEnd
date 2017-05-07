var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var ClientCollection = require('../data_access/client.js').Collection

var OrderCollection = require('../data_access/order.js').Collection

router = new Router();

router.use(function*(next) {

    if (this.isAuthenticated()) {
        clientOperation = new ClientCollection(this.req.user.clientCollection);
        orderOperation = new OrderCollection(this.req.user.collection);

    }

    yield next

})

router.post('/clients', function*() {

    var clientsData = this.request.body;

    var clients = clientsData.clients;

    clients.forEach(function(client) {

        delete client.isChanged;
        delete client.isActive;

        if (ObjectID.isValid(client._id)) {

            client._id = new ObjectID(client._id);
            client.createDate = new Date(client.createDate);

        } else {

            delete client._id

            client.createDate = new Date();
        }

        delete client.__ko_mapping__

        if (Array.isArray(client.addresses)) {
            client.addresses.forEach(address => {

                delete address.isChanged

                if(address.isActive=='true'){
                    address.isActive=true;
                }else if(address.isActive=='false'){
                    address.isActive=false;
                }

            });

        }

    });

    yield clientOperation.saveClients(clients);


    this.body = clients;
    this.status = 200;

});

router.get('/clients', function*() {

    var allClients = yield getClients();

    yield this.render('clients', {
        clients: allClients,
        css: '',
        name: 'clients',
        header: 'specific',
        footer: '',
        needMask: false

    });

});

router.get('/clientsJson', function*() {

    var allClients = yield getClients();

    this.body = allClients;
    this.status = 200;

});

function* getClients() {
    var allClients = yield clientOperation.queryClients()

    var receivedOrders = yield orderOperation.queryPrintedOrders();

    var activeClients = receivedOrders.map(function(order) {

        var index = allClients.findIndex(function(client) {
            return order.client == client.name;
        });

        if (index < 0) {
            return { name: order.client, isActive: true,currentAddress:0, addresses: [{ recipient: '', phone: '', address: '',isActive:true }] }

        } else {

            let client = allClients[index];

            client.isActive = true;

            allClients.splice(index, 1);
            return client;
        }

    });

    var clients = activeClients.concat(allClients);


    return clients;
}



router.delete('/client/:id', function*() {
    var id = this.params.id;

    var res = yield clientOperation.removeById(id);
    this.body = res;
    this.status = 200;

});


exports.router = router;
