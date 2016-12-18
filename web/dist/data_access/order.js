var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://127.0.0.1:27017/orders'; //'mongodb://127.0.0.1:27017/orders';

//'mongodb://127.0.0.1:27017/orders'
var Collection = function(_name) {

    return {

        insert: function(order) {

            return new Promise(function(resolve, reject) {

                MongoClient.connect(url, function(err, db) {

                    if (db) {
                        db.collection(_name).insertOne(order, function(err, res) {

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
        updateById: function*(id, order) {

            var db = yield MongoClient.connect(url);

            //order = JSON.parse(JSON.stringify(order));

            var id = order._id;
            delete order._id;

            var res = yield db.collection(_name).replaceOne({
                "_id": new ObjectID(id)
            }, order);

            order._id = id;

            return res;
        },

        updateOrderStatus: function*(id, status) {

            var db = yield MongoClient.connect(url);


            var res = yield db.collection(_name).updateOne({
                "_id": new ObjectID(id)
            }, { $set: { "status": status } });

            return res;

        },
        updatePackingStatus: function*(id, status) {

            var db = yield MongoClient.connect(url);


            var res = yield db.collection(_name).updateOne({
                "_id": new ObjectID(id)
            }, { $set: { "packingStatus": status } });

            return res;

        },
        queryReceivedOrders: function*() {

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).find({ status: '1RECEIVED' }).sort({ 'packingStatus': 1, 'createDate': -1 }).toArray();

            return res;

        },

        /*    queryOrders: function*(filter) {


                var db = yield MongoClient.connect(url);

                var res = yield db.collection(_name).find(filter).toArray();

                return res;


            },*/
        queryGlobalOrders: function*(text) {




            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{
                    $match: { $text: { $search: text } }
                },

                {
                    $lookup: {
                        from: "addresses",
                        localField: "client",
                        foreignField: "client",
                        as: "addresses"
                    }
                }

            ], { cursor: { batchSize: 1 } }).sort({ 'status': 1, 'createDate': -1 }).toArray();


            return res;

        },

        queryReckoningOrders: function*() {

            var currentMiliSeconds = Date.now();

            var currentDay = new Date().getDay();

            var startMiliSeconds = currentMiliSeconds - ((currentDay + 7) * 24 * 60 * 60 * 1000);

            var startDate = new Date(new Date(startMiliSeconds).setHours(0, 0, 0, 0));

            //, { createDate: { $gt:startDate } }


            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{
                    $match: { $or: [{ status: '1RECEIVED' }, { status: '2SENT' }, { createDate: { $gt: startDate } }] }
                },

                {
                    $lookup: {
                        from: "addresses",
                        localField: "client",
                        foreignField: "client",
                        as: "addresses"
                    }
                }

            ], { cursor: { batchSize: 1 } }).sort({ 'status': 1, 'createDate': -1 }).toArray();


            return res;

        },
        summarizeProfit: function*() {

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{
                    $match: { $or: [{ status: '3DONE' }, { status: '2SENT' }] }
                }, {
                    $project: {
                        _id: 0,
                        client: 1,
                        status: 1,
                        buyPrice: 1,
                        sellPrice: 1,
                        profit: 1,
                        createDate: 1,
                        localWeek: { $let: { vars: { localDate: { $add: ['$createDate', 28800000] } }, in : { $week: '$$localDate' } } },
                        localYear: { $let: { vars: { localDate: { $add: ['$createDate', 28800000] } }, in : { $year: '$$localDate' } } },
                        dayOfWeek: { $let: { vars: { localDate: { $add: ['$createDate', 28800000] } }, in : { $dayOfWeek: '$$localDate' } } }
                    }
                }, {
                    $project: {
                        _id: 0,
                        client: 1,
                        status: 1,
                        buyPrice: 1,
                        sellPrice: 1,
                        profit: 1,
                        createDate: 1,
                        localWeek: { $cond: [{ $eq: ["$dayOfWeek", 1] }, { $subtract: ["$localWeek", 1] }, '$localWeek'] },
                        localYear: 1
                    }
                }, {
                    $group: {
                        _id: { 'year': '$localYear', 'week': '$localWeek' },
                        firstDate: { '$first': '$createDate' },
                        lastDate: { '$last': '$createDate' },
                        cost: {
                            $sum: '$buyPrice'

                        },
                        revenue: {
                            $sum: '$sellPrice'

                        },
                        income: {
                            $sum: '$profit'
                        }
                    }
                }, {
                    $project: { _id: 0, year: '$_id.year', week: '$_id.week', firstDate: '$firstDate', lastDate: '$lastDate', cost: 1, revenue: 1, income: 1 }

                }

            ], { cursor: { batchSize: 1 } }).sort({ 'week': -1 }).toArray();

            return res;

        },

        remove: function*(id) {

            if (!ObjectID.isValid(id)) {
                return { ok: 1, n: 0 };
            }

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).deleteOne({
                '_id': new ObjectID(id)
            });

            return res;
        },
        getHistoricTrades: function*(itemName) {

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{

                    $match: { $or: [{ status: '2SENT' }, { status: '3DONE' }], 'items.name': itemName }

                }, {
                    $limit: 10
                }, {
                    $unwind: {

                        path: '$items',

                        preserveNullAndEmptyArrays: true
                    }
                }, {

                    $match: { 'items.name': itemName, 'items.sellPrice': { $gt: 0 } }

                }, {
                    $project: { _id: 0, client: 1, createDate: 1, status: 1, name: '$items.name', quantity: '$items.quantity', buyPrice: '$items.buyPrice', sellPrice: '$items.sellPrice', isDone: '$items.isDone' }
                }

            ], { cursor: { batchSize: 1 } }).sort({ 'createDate': -1 }).toArray();

            return res;


        }

    };

}

exports.Collection = Collection;
