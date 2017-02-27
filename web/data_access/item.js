var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://website:zombie.123@127.0.0.1:27017/orders';




var Collection = function(_name) {


    return {

        queryItems: function*() {

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{

                    $match: {
                        status: '1RECEIVED'
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
            }).sort({ '_id': 1 }).toArray();

            return res;


        },

        queryItemsByMark: function*() {

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{

                    $match: {
                        status: '1RECEIVED'
                    }

                }, {
                    $unwind: {

                        path: '$items',

                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        '_id': {
                            'note': '$items.note',
                            'name': '$items.name'

                        },
                        'quantity': {
                            $sum: '$items.quantity'
                        }
                    }
                }, {

                    $project: { '_id': 0, note: '$_id.note', name: '$_id.name', quantity: '$quantity' }

                }

            ], {
                cursor: {
                    batchSize: 1
                }
            }).sort({ 'note': 1, 'name': 1 }).toArray();

            return res;


        },

        updateItemStatus: function*(itemName, status) {

            var db = yield MongoClient.connect(url);


            var res = yield db.collection(_name).updateMany({
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

            var res = yield db.collection(_name).aggregate([{

                    $match: {
                        status: '1RECEIVED',
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

            var res = yield db.collection(_name).aggregate([{

                    $match: { status: '1RECEIVED', 'items.name': itemName }

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
}
exports.Collection = Collection;
