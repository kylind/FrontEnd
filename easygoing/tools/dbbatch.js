var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://website:zombie.123@127.0.0.1:27017/orders'; //'mongodb://website:zombie.123@127.0.0.1:27017/orders';


var users = Symbol('users');
var users = Symbol('users');

class Order {

    constructor(users) {

        this[users] = users;

    }

    synchronizeClients() {

        var db = MongoClient.connect(url);


        this[users].forEach(function(user) {

            let orders = `${user}_orders`;
            let clients = `${user}_clients`;

            let newClients = db.collection(orders).aggregate([{
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

                db.collection(clients).save(client);

            });

        });


    }

    synchronizeProducts() {

        var db = MongoClient.connect(url);


        this[users].forEach(function(user) {

                let orders = `${user}_orders`;
                let clients = `${user}_clients`;


                var historicProducts = db.xumin_orders.aggregate([{
                    $unwind: {

                        path: '$items',

                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $match: {
                        'items.buyPrice': { $nin: [null, ''] }
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


                var products = db.xumin_products.find().toArray();


                historicProducts.forEach(function(historicProduct) {

                    var product = products.find(product => product.name == historicProduct.name);

                    if (product && (product.sellPrice != historicProduct.sellPrice || product.buyPrice != historicProduct.buyPrice)) {

                        product.sellPrice = historicProduct.sellPrice;
                        product.buyPrice = historicProduct.buyPrice;
                        if (product.status == 'MANUAL' || product.status == 'MODIFIED') {
                            product.status = 'OVERRIDE';
                        }

                        db.xumin_products.save(product);

                    } else {
                        db.xumin_products.save(historicProduct);
                    }

                });

            }

        }
    }
