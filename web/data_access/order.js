var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var dbOperations = {
    insert: function(order) {
        var url = 'mongodb://localhost:27017/local';

        var insertDocument = function(db, callback) {
            db.collection('orders').insertOne(order, function(err, result) {
                assert.equal(err, null);
                callback();
            });
        };

        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            insertDocument(db, function() {
                db.close();
            });
        });
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

    update: function() {
        var url = 'mongodb://localhost:27017/local';

        function update(db, callback) {
            db.collection('restaurants').updateOne(
                { "name": "Vella" },

                { $set: { "cuisine": "Chinese" } },

                function(error, result){
                    assert.equal(error, null);
                }
            );

        }

        MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);
            update(db, function() {
                db.close();
            });
        });
    },

    remove: function() {
        var url = 'mongodb://localhost:27017/local';

        function remove(db, callback) {
            db.collection('restaurants').deleteOne(
                { "name": "Vella" },
                function(error, result){
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

exports.db=dbOperations;
