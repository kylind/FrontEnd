var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/local';



var collection = {
    insert: function(order) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {

                if (db) {
                    db.collection('orders').insertOne(order, function(err, res) {

                        if (res) {
                            resolve(res);
                        } else {
                            reject(err);
                        }
                    });

                } else {
                    reject(err);
                }
            });
        });


    },
    updateById: function*(id, order) {

        var db = yield MongoClient.connect(url);

        order = JSON.parse(JSON.stringify(order));
        delete order._id;

        var res = yield db.collection('orders').replaceOne({
            "_id": new ObjectId(id)
        }, order);

        return res;
    },

    queryOrders: function*(filter) {


        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').find(filter).toArray();

        return res;


    },

    queryItems: function*() {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: {
                    status: 'RECEIVED'
                }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    '_id': {
                        'name': '$items.name',
                        'isDone': '$items.isDone'
                    },
                    'quantity': {
                        $sum: '$items.quantity'
                    }
                }
            }, {
                $group: {
                    '_id': '$_id.name',
                    'purchaseDetail': {
                        $push: {
                            'isDone': '$_id.isDone',
                            'quantity': '$quantity'
                        }
                    },
                    'quantity': {
                        $sum: '$quantity'
                    }
                }
            }

        ], {
            cursor: {
                batchSize: 1
            }
        }).toArray();

        return res;

        /*return Promise.resolve([{
            _id: 'p1',
            quantity: 5,
            purchaseDetail: [{ isDone: false, quantity: 5 }]
        }, {
            _id: 'p2',
            quantity: 8,
            purchaseDetail: [{ isDone: false, quantity: 5 }]
        }]);*/

    },

    updateItemStatus: function*(itemName, status) {

        var db = yield MongoClient.connect(url);


        var res = yield db.collection('orders').updateMany({
            'items.name': itemName

        }, {
            $set: {
                'items.$.isDone': status
            }
        });

        return res;

    },
    getItemStatus: function*(itemName) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: {
                    status: 'RECEIVED',
                    'items.name': itemName
                }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {

                $match: {
                    'items.name': itemName
                }

            }, {
                $group: {
                    '_id': {
                        'name': '$items.name',
                        'isDone': '$items.isDone'
                    },
                    'quantity': {
                        $sum: '$items.quantity'
                    }
                }
            }, {
                $group: {
                    '_id': '$_id.name',
                    'purchaseDetail': {
                        $push: {
                            'isDone': '$_id.isDone',
                            'quantity': '$quantity'
                        }
                    },
                    'quantity': {
                        $sum: '$quantity'
                    }
                }
            }

        ], {
            cursor: {
                batchSize: 1
            }
        }).toArray();

        return res;

        /* return Promise.resolve([{
             _id: 'p1',
             quantity: 5,
             purchaseDetail: [{ isDone: false, quantity: 5 }]
         }]);*/

    },
    getSubItems: function*(itemName) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: { status: 'RECEIVED', 'items.name': itemName }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {

                $match: { 'items.name': itemName }

            }, {
                $project: { client: 1, createDate: 1, status: 1, name: '$items.name', quantity: '$items.quantity', note: '$items.note', isDone: '$items.isDone' }
            }

        ], { cursor: { batchSize: 1 } }).toArray();

        return res;

        /*
                return Promise.resolve([{
                    client: 'kylin',
                    _id: 'abcdefg',
                    items: {
                        name: 'p1',
                        quantity: 2,
                        note: '',
                        isDone:false
                    },
                    status: 'RECEIVED',
                    createDate: new Date().toLocaleDateString('en-us')
                }, {
                    client: 'kylin',
                    _id: 'abcdefg',
                    items: {
                        name: 'p1',
                        quantity: 3,
                        note: '',
                        isDone:false
                    },
                    status: 'RECEIVED',
                    createDate: new Date().toLocaleDateString('en-us')
                }])*/

    },
    queryReckoningOrders: function*(filter) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([

            {
                $lookup: {
                    from: "addresses",
                    localField: "client",
                    foreignField: "client",
                    as: "addresses"
                }
            }

        ], { cursor: { batchSize: 1 } }).toArray();


        return res;

    },

    getHistoricTrades: function*(itemName) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: { status: 'RECEIVED', 'items.name': itemName }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {

                $match: { 'items.name': itemName }

            }, {
                $project: { _id: 0, client: 1, createDate: 1, status: 1, name: '$items.name', quantity: '$items.quantity', buyPrice: '$items.buyPrice', sellPrice: '$items.sellPrice', isDone: '$items.isDone' }
            }

        ], { cursor: { batchSize: 1 } }).toArray();

        return res;


    },
    remove: function() {
        var url = 'mongodb://localhost:27017/local';

        function remove(db, callback) {
            db.collection('restaurants').deleteOne({
                    "name": "Vella"
                },
                function(error, result) {
                    assert.equal(error, null);
                }
            );
        };

        MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);
            remove(db, function() {
                db.close();
            });
        });
    }

};

exports.collection = collection;
