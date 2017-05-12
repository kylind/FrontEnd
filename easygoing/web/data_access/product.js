var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://website:zombie.123@127.0.0.1:27017/orders'; //'mongodb://website:zombie.123@127.0.0.1:27017/orders';

class Collection {



    constructor(_name) {

        this.name = _name;

    }

    * queryProducts() {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection(this.name).find().sort({ 'createDate': -1, 'name': 1 }).toArray();

        return res;

    }

    * insert(product) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {

                if (db) {
                    db.collection(this.name).insertOne(product, function(err, res) {

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

    }

    * save(products) {

        var db = yield MongoClient.connect(url);

        products.forEach(doc => db.collection(this.name).save(doc));


        return products;

    }


    * remove(id) {

        if (!ObjectID.isValid(id)) {
            return { ok: 1, n: 0 };
        }

        var db = yield MongoClient.connect(url);

        var res = yield db.collection(this.name).deleteOne({
            '_id': new ObjectID(id)
        });

        return res;
    }

}


exports.Collection = Collection;
