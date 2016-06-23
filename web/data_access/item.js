var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/local';

var collection = {

    queryItems: function*() {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: {
                    status: 'RECEIVED'
                }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {
                $group: {
                    '_id': {
                        'name': '$items.name',
                        'isDone': '$items.isDone'
                    },
                    'quantity': {
                        $sum: '$items.quantity'
                    }
                }
            }, {
                $group: {
                    '_id': '$_id.name',
                    'purchaseDetail': {
                        $push: {
                            'isDone': '$_id.isDone',
                            'quantity': '$quantity'
                        }
                    },
                    'quantity': {
                        $sum: '$quantity'
                    }
                }
            }

        ], {
            cursor: {
                batchSize: 1
            }
        }).toArray();

        return res;


    },

    updateItemStatus: function*(itemName, status) {

        var db = yield MongoClient.connect(url);


        var res = yield db.collection('orders').updateMany({
            'items.name': itemName

        }, {
            $set: {
                'items.$.isDone': status
            }
        });

        return res;

    },
    queryItemStatus: function*(itemName) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: {
                    status: 'RECEIVED',
                    'items.name': itemName
                }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {

                $match: {
                    'items.name': itemName
                }

            }, {
                $group: {
                    '_id': {
                        'name': '$items.name',
                        'isDone': '$items.isDone'
                    },
                    'quantity': {
                        $sum: '$items.quantity'
                    }
                }
            }, {
                $group: {
                    '_id': '$_id.name',
                    'purchaseDetail': {
                        $push: {
                            'isDone': '$_id.isDone',
                            'quantity': '$quantity'
                        }
                    },
                    'quantity': {
                        $sum: '$quantity'
                    }
                }
            }

        ], {
            cursor: {
                batchSize: 1
            }
        }).toArray();

        return res;

    },
    querySubItems: function*(itemName) {

        var db = yield MongoClient.connect(url);

        var res = yield db.collection('orders').aggregate([{

                $match: { status: 'RECEIVED', 'items.name': itemName }

            }, {
                $unwind: {

                    path: '$items',

                    preserveNullAndEmptyArrays: true
                }
            }, {

                $match: { 'items.name': itemName }

            }, {
                $project: { client: 1, createDate: 1, status: 1, name: '$items.name', quantity: '$items.quantity', note: '$items.note', isDone: '$items.isDone' }
            }

        ], { cursor: { batchSize: 1 } }).toArray();

        return res;

    }
};

exports.collection = collection;
