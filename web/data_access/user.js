var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:27017/orders';


var collection = {

    insertOne: function*(user) {
        var db = yield MongoClient.connect(url);

        delete user._id

        user.status = 'NEW';
        user.collection = user.name + "_orders";
        user.rate = 0.9;
        res = yield db.collection('siteusers').insertOne(user);

        return res;

    },
    updateOne: function*(user) {
        var db = yield MongoClient.connect(url);

        var id = user._id;
        delete user._id;

        if (user.password == '') {
            delete user.password;
        }

        var res = yield db.collection('siteusers').updateOne({
            "_id": new ObjectID(id)
        }, {$set:user});





        /* var res = yield db.collection('siteusers').replaceOne({
             "_id": new ObjectID(id)
         }, user);*/


        user._id = id;

        return res;

    },
    queryUser: function(userName) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {
                db.collection('siteusers').findOne({ name: userName }).then(function(rs) {

                    resolve(rs);
                });

            });

        })

    },
    queryUserById: function(_id) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {
                db.collection('siteusers').findOne({ _id: new ObjectID(_id) }).then(function(rs) {

                    resolve(rs);
                });

            });

        })

    }

};

exports.collection = collection;
