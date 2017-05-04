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

    saveClients: function*(clients) {

                var db = yield MongoClient.connect(url);

                clients.forEach(function(doc) {
                    db.collection(_name).save(doc);
                });

                return clients;
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
    }



};

exports.collection = collection;
