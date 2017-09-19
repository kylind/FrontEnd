var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var ClientCollection = require('../data_access/client.js').Collection

var OrderCollection = require('../data_access/order.js').Collection

var router = new Router();

//var orderOperation, clientOperation;

function getClientCollection(req){
  
    return new ClientCollection(req.user.clientCollection);

}
function getOrderCollection(req){
  
    return new OrderCollection(req.user.collection, req.user.productCollection);

}
router.use(function*(next) {

    if (this.isAuthenticated()) {
       // clientOperation = new ClientCollection(this.req.user.clientCollection);
        //orderOperation = new OrderCollection(this.req.user.collection, this.req.user.productCollection);

    }

    yield next

})

router.post('/clients', function*() {

    var clientsData = this.request.body;

    var clients = clientsData.clients;

    clients.forEach(function(client) {

        delete client.isChanged;
        delete client.isActive;
        delete client.mailType;

        if (ObjectID.isValid(client._id)) {

            client._id = new ObjectID(client._id);
            client.createDate = new Date(client.createDate);

        } else {

            delete client._id;

            client.createDate = new Date();
        }

        delete client.__ko_mapping__


        let name = client.name.trim().replace(/[\?\uff1f]$/, '?');
        name = name.replace(/[\-\uff0d]/g, '-');

        client.name = name;

        if (Array.isArray(client.addresses)) {
            client.addresses.forEach(address => {

                delete address.isChanged;
                delete address.defaultAddressCss;
                delete address.defaultAddressMarkCss;

                if (address.isActive == 'true') {
                    address.isActive = true;
                } else if (address.isActive == 'false') {
                    address.isActive = false;
                }

            });

        }

    });

    let clientOperation=getClientCollection(this.req);

    yield clientOperation.saveClients(clients);


    this.body = clients;
    this.status = 200;

});

router.get('/clients', function*() {

    var allClients = yield getClients(this.req);

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

    var allClients = yield getClients(this.req);

    this.body = allClients;
    this.status = 200;

});


router.get('/allClientNamesJson', function*() {

    let clientOperation=getClientCollection(this.req);
    var res = yield clientOperation.queryClients();

    clientNames = res.map(client => client.name);


    this.body = clientNames;
    this.status = 200;

});

router.get('/clientsByKeywords', function*() {

    var req = this.request.query;

    var keywords = req.keywords;

    let clientOperation=getClientCollection(this.req);

    var searchedClients = yield clientOperation.queryClientsByKeywords(keywords);

    this.body = searchedClients;
    this.status = 200;

});






function* getClients(req) {
    let clientOperation=getClientCollection(req);
    var allClients = yield clientOperation.queryClients()

    let orderOperation = getOrderCollection(req);

    var receivedOrders = yield orderOperation.queryPrintedOrders();

    var activeClients = receivedOrders.map(function(order) {

        let name = order.client.trim().replace(/[\?\uff1f]$/, ''); ///[\uff00|\uff1f]/g

        //name = name.replace(/[\-\uff00]/g, '-');

        var index = allClients.findIndex(function(client) {

            //let clientName = order.client.trim().replace(/[\uff00]/g, '-');

            return name == client.name;

        });



        let mailType = 'common';

        if (order.client.search(/[\?\uff1f]$/) > -1) {
            mailType = 'sf';
        }

        if (index < 0) {

            return { name: name, isActive: true, currentAddress: 0, mailType: mailType, addresses: [{ recipient: '', phone: '', address: '', isActive: true }] }

        } else {

            let client = allClients[index];
            client.isActive = true;
            client.mailType = mailType;

            return client;
        }

    });

    return activeClients;
}



router.delete('/client/:id', function*() {
    var id = this.params.id;

    let clientOperation=getClientCollection(this.req);

    var res = yield clientOperation.removeById(id);
    this.body = res;
    this.status = 200;

});


exports.router = router;
