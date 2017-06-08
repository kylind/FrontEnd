var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://website:zombie.123@127.0.0.1:27017/orders'; //'mongodb://website:zombie.123@127.0.0.1:27017/orders';


var users = Symbol('users');


class Order {

    constructor(_users) {

        this[users] = _users;

    }

    async synchronizeClients() {

        console.log(`Start synchronizing Clients...`);

        var db = await MongoClient.connect(url);




        for (let user of this[users]) {

            let orders = `${user}_orders`;
            let clients = `${user}_clients`;


            console.log(`Start synchronizing clients for ${user}...`);


            let newClients = await db.collection(orders).aggregate([{
                $group: {
                    '_id': '$client'

                }
            }, {

                $lookup: {
                    from: clients,
                    localField: "_id",
                    foreignField: "name",
                    as: "clientInfo"
                }

            }, {
                $match: {
                    clientInfo: { $size: 0 }
                }
            }, {
                $addFields: {
                    'addresses': [],
                    'createDate': new Date()
                }
            }, {
                $project: { '_id': 0, name: '$_id', createDate: 1, 'addresses': 1 }
            }], {
                cursor: {
                    batchSize: 1
                }
            }).toArray();

            newClients.forEach(function(client) {

                console.log(`New client: ${client.name}!`)

                db.collection(clients).save(client);

            });

            console.log(`Finish synchronizing client for ${user}!`)

        }

        console.log(`Finish synchronizing Clients...`);

    }

    async synchronizeProducts() {

        console.log(`Start synchronizing products...`);


        var db = await MongoClient.connect(url);


        for (let user of this[users]) {

            console.log(`Start synchronizing products for ${user}...`);

            let orders = `${user}_orders`;
            let products = `${user}_products`;

            var allProducts = await db.collection(orders).aggregate([{
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {
                $match: {
                    'items.buyPrice': { $nin: [null, ''] },
                    'items.sellPrice': { $nin: [null, ''] }

                }

            }, {
                $group: {
                    '_id': '$items.name',

                    'buyPrice': { $last: '$items.buyPrice' },
                    'sellPrice': { $last: '$items.sellPrice' }
                }
            }, {
                $addFields: {
                    'status': 'IMPORT',
                    'modifiedDate': new Date()
                }
            }, {
                $project: { '_id': 0, name: '$_id', buyPrice: 1, sellPrice: 1, status: 1, modifiedDate: 1 }
            }], {
                cursor: {
                    batchSize: 1
                }
            }).sort({ 'name': 1 }).toArray();

            let existingProducts = await db.collection(products).find().toArray();


            allProducts.forEach(function(_product) {

                var product = existingProducts.find(product => product.name == _product.name);

                if (product && (product.sellPrice != _product.sellPrice || product.buyPrice != _product.buyPrice)) {

                    product.sellPrice = _product.sellPrice;
                    product.buyPrice = _product.buyPrice;
                    if (product.status == 'MANUAL' || product.status == 'MODIFIED') {
                        product.status = 'OVERRIDE';
                    }

                    console.log(`update product: ${product.name}!`)

                    db.collection(products).save(product);

                } else if (!product) {
                    console.log(`new product: ${_product.name}!`)
                    db.collection(products).save(_product);
                }

            });

            console.log(`Finish synchronizing products for ${user}...`);

        }

        console.log(`Finish synchronizing products...`);

    }
}


async function synchronizing() {

    var order = new Order(['zhuqin','xiangxiang','yangna','xumin','Mabing']);

    await order.synchronizeClients();
    await order.synchronizeProducts();
}


synchronizing();
