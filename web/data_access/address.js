var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/local';

var collection = {
    insert: function(address) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {

                if (db) {
                    db.collection('address').insertOne(address, function(err, res) {

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
    updateById: function*(id, address) {

        var db = yield MongoClient.connect(url);

        address = JSON.parse(JSON.stringify(address));
        delete address._id;

        var res = yield db.collection('address').replaceOne({
            "_id": new ObjectId(id)
        }, address);

        return res;
    },

    upinsertMany: function*(addresses) {

        if (Array.isArray(addresses)) {

            addresses.forEach(function(address) {

                if (ObjectID.isValid(address._id)) {

                    res = yield collection.updateById(address._id, address);

                } else {

                    delete address._id
                    res = yield collection.insert(address);
                }

            })
        }

        return addresses;


    }










};

exports.collection = collection;
