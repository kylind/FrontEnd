var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://website:zombie.123@120.24.63.42:27017/orders';



var collection = {

    queryAddresses: function*(filter) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('addresses').find(filter).toArray();

        return res;

    },
    insertOne: function(address) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {

                if (db) {
                    db.collection('addresses').insertOne(address, function(err, res) {

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

        var res = yield db.collection('addresses').replaceOne({
            "_id": new ObjectID(id)
        }, address);

        return res;
    },

    saveAddresses: function*(client, addresses, removedAddresses) {

        //yield collection.deleteMany(client);

        if (Array.isArray(removedAddresses) && removedAddresses.length > 0) {
            for (var i = 0; i < removedAddresses.length; i++) {

                yield collection.removeById(removedAddresses[i]);
            }
        }

        if (Array.isArray(addresses) && addresses.length > 0) {

            for (var i = 0; i < addresses.length; i++) {
                yield collection.saveAddress(addresses[i]);
            }
        }

    },

    saveAddress: function*(address) {


        if (ObjectID.isValid(address._id)) {

            res = yield collection.updateById(address._id, address);

        } else {

            delete address._id
            res = yield collection.insertOne(address);
        }

    },
    removeById: function*(id) {
        var db = yield MongoClient.connect(url);

        if (!ObjectID.isValid(id)) {
            return { ok: 1, n: 0 };
        } else {

            var res = yield db.collection('addresses').deleteOne({
                '_id': new ObjectID(id)
            });

            return res;

        }
    },

    removeByClient: function*(client) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('addresses').deleteMany({ "client": client });
        return res;
    },

    insertMany: function*(addresses) {

        var db = yield MongoClient.connect(url);

        addresses.forEach(function(address) {
            delete address._id;
        });

        var res = yield db.collection('addresses').insertMany(addresses);
        return res;

    }

};

exports.collection = collection;
