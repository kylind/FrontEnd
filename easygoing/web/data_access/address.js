var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://website:zombie.123@127.0.0.1:27017/orders';//mongodb://website:zombie.123@127.0.0.1:27017/orders

//mongodb://website:zombie.123@127.0.0.1:27017/orders

var collection = {

    queryClients: function*(filter) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('clients').find(filter).toArray();

        return res;

    },
    insertOne: function(client) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {

                if (db) {
                    db.collection('clients').insertOne(client, function(err, res) {

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
    updateById: function*(id, client) {

        var db = yield MongoClient.connect(url);

        client = JSON.parse(JSON.stringify(client));
        delete client._id;

        var res = yield db.collection('clients').replaceOne({
            "_id": new ObjectID(id)
        }, client);

        return res;
    },

    saveClients: function*(client, clients, removedClients) {

        //yield collection.deleteMany(client);

        if (Array.isArray(removedClients) && removedClients.length > 0) {
            for (var i = 0; i < removedClients.length; i++) {

                yield collection.removeById(removedClients[i]);
            }
        }

        if (Array.isArray(clients) && clients.length > 0) {

            for (var i = 0; i < clients.length; i++) {
                yield collection.saveClient(clients[i]);
            }
        }

    },

    saveClient: function*(client) {


        if (ObjectID.isValid(client._id)) {

            res = yield collection.updateById(client._id, client);

        } else {

            delete client._id
            res = yield collection.insertOne(client);
        }

    },
    removeById: function*(id) {
        var db = yield MongoClient.connect(url);

        if (!ObjectID.isValid(id)) {
            return { ok: 1, n: 0 };
        } else {

            var res = yield db.collection('clients').deleteOne({
                '_id': new ObjectID(id)
            });

            return res;

        }
    },

    removeByClient: function*(client) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('clients').deleteMany({ "client": client });
        return res;
    },

    insertMany: function*(clients) {

        var db = yield MongoClient.connect(url);

        clients.forEach(function(client) {
            delete client._id;
        });

        var res = yield db.collection('clients').insertMany(clients);
        return res;

    }

};

exports.collection = collection;
