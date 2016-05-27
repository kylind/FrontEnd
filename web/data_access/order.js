var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var collection = {
    insert: function(order) {
        var url = 'mongodb://localhost:27017/local';

        return Promise.resolve({"ok":1,"n":1});

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

    },
    update: function* (order) {
        var url = 'mongodb://localhost:27017/local';

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').replaceOne({ "_id": new ObjectId(order.id) }, order);

        return res;
    },

    query: function() {
        var url = 'mongodb://localhost:27017/local';

        function query(db, callback) {
            var cursor = db.collection('restaurants').find({ "name": "Vella" });
            cursor.forEach(function(doc, error) {
                assert.equal(error, null);
                if (doc) {
                    console.log(doc.cuisine);
                } else {
                    callback();
                }

            })
        };

        MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);
            query(db, function() {
                db.close();
            });
        });
    },



    remove: function() {
        var url = 'mongodb://localhost:27017/local';

        function remove(db, callback) {
            db.collection('restaurants').deleteOne({ "name": "Vella" },
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
