var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
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
            "_id": new ObjectID(id)
        }, order);

        return res;
    },

    queryOrders: function*(filter) {


        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').find(filter).toArray();

        return res;


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

    remove: function*(id) {

        if (!ObjectID.isValid(id)) {
            return { ok: 1, n: 0 };
        }

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').deleteOne({
            '_id': new ObjectID(id)
        });

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

                $match: { 'items.name': itemName, 'items.sellPrice': { $gt: 0 } }

            }, {
                $project: { _id: 0, client: 1, createDate: 1, status: 1, name: '$items.name', quantity: '$items.quantity', buyPrice: '$items.buyPrice', sellPrice: '$items.sellPrice', isDone: '$items.isDone' }
            }

        ], { cursor: { batchSize: 1 } }).toArray();

        return res;


    }

};

exports.collection = collection;
