var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var dbOperations = {
    add: function() {
        var url = 'mongodb://website:zombie.123@localhost:27017/orders';

        var insertDocument = function(db, callback) {
            db.collection('restaurants').insertOne({
                "address": {
                    "street": "2 Avenue",
                    "zipcode": "10075",
                    "building": "1480",
                    "coord": [-73.9557413, 40.7720266]
                },
                "borough": "Manhattan",
                "cuisine": "Italian",
                "grades": [{
                    "date": new Date("2014-10-01T00:00:00Z"),
                    "grade": "A",
                    "score": 11
                }, {
                    "date": new Date("2014-01-16T00:00:00Z"),
                    "grade": "B",
                    "score": 17
                }],
                "name": "Vella",
                "restaurant_id": "41704620"
            }, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the restaurants collection.");
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
        var url = 'mongodb://website:zombie.123@localhost:27017/orders';

        function query(db, callback) {
            var cursor = db.collection('restaurants').find({
                "name": "Vella"
            });
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
        var url = 'mongodb://website:zombie.123@localhost:27017/orders';

        function update(db, callback) {
            db.collection('restaurants').updateOne({
                    "name": "Vella"
                },

                {
                    $set: {
                        "cuisine": "Chinese"
                    }
                },

                function(error, result) {
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
        var url = 'mongodb://website:zombie.123@localhost:27017/orders';

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

dbOperations.add();

dbOperations.update();

dbOperations.query();

dbOperations.remove();
