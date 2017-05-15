var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://website:zombie.123@127.0.0.1:27017/orders'; //mongodb://website:zombie.123@127.0.0.1:27017/orders

//mongodb://website:zombie.123@127.0.0.1:27017/orders

class Collection {

    constructor(_name) {

        this.name = _name;


    }

    * queryClientsByKeywords(keywords) {

        var db = yield MongoClient.connect(url);

        let regex = `.*${keywords}.*`;

        var res = yield db.collection(this.name).find({
            name: { $regex: regex }
        }).toArray();

        return res;
    }

    * queryClients(filter) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection(this.name).find(filter).sort({ 'createDate': -1 }).toArray();

        return res;

    }

    * saveClients(clients) {

        var db = yield MongoClient.connect(url);

        clients.forEach(doc => db.collection(this.name).save(doc));

        return clients;
    }


    * removeById(id) {
        var db = yield MongoClient.connect(url);

        if (!ObjectID.isValid(id)) {
            return { ok: 1, n: 0 };
        } else {

            var res = yield db.collection(this.name).deleteOne({
                '_id': new ObjectID(id)
            });

            return res;

        }
    }



}

exports.Collection = Collection;
