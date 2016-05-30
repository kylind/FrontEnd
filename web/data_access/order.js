var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var collection = {
    insert: function(order) {
        var url = 'mongodb://localhost:27017/local';

        /*return new Promise(function(resolve, reject) {

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
        });*/

        return Promise.resolve({
            n: 1,
            row: 2
        });


    },
    update: function*(order) {
        var url = 'mongodb://localhost:27017/local';

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').replaceOne({
            "_id": new ObjectId(order.id)
        }, order);

        return res;
    },

    query: function* (filter) {

        var order = {
            _id: '',
            client: 'Yolanda',
            items: [{
                name: "Tall Hat",
                quantity: 39,
                note: ''
            }, {
                name: "Long Cloak",
                quantity: 10,
                note: 'require discount'
            }]
        }

        return Promise.resolve(order);

/*
        var url = 'mongodb://localhost:27017/local';

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').find(filter).toArray();

        return res;*/


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
