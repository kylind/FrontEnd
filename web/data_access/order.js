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

    query: function*(filter) {


        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').find(filter).toArray();

        return res;


    },

    queryPurchaseItems: function*() {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: { status: 'RECEIVED' }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: { '_id': {'name': '$items.name','isDone':'$items.isDone'}, 'quantity': { $sum: '$items.quantity' } }
            }

        ],{ cursor: { batchSize: 1 } }).toArray();

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
