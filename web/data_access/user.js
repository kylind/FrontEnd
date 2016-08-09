var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:27017/orders';


var collection = {

    queryUser: function(userName) {

        return new Promise(function(resolve, reject) {

            MongoClient.connect(url, function(err, db) {
                db.collection('siteusers').findOne({ name: userName }).then(function(rs){

                    resolve(rs);
                });

            });

        })

    }

};

exports.collection = collection;
