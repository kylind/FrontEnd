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
                        'tag': { $last: '$items.tag' },
                        'quantity': {
                            $sum: '$items.quantity'
                        }
                    }
                }, {
                    $group: {
                        '_id': {
                            'name': '$_id.name',
                        },
                        'purchaseDetail': {
                            $push: {
                                'isDone': '$_id.isDone',
                                'quantity': '$quantity'
                            }
                        },
                        'tag': { $last: '$tag' },
                        'quantity': {
                            $sum: '$quantity'
                        }
                    }
                }, {

                    $project: { '_id': '$_id.name', tag: 1, quantity: 1, purchaseDetail: 1 }

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

        updateItemStatus: function*(itemName, itemTag, status) {

            var db = yield MongoClient.connect(url);



            var query = {
                'status': '1RECEIVED',
                'items': {
                    $elemMatch: {
                        name: itemName,
                        isDone: !status
                    }
                }

            };


            var docs = yield db.collection(_name).find(query).toArray();

            docs.forEach(function(doc) {
                doc.items.forEach(function(item) {
                    if (item.name == itemName) {
                        item.isDone = status;
                    }
                });
                db.collection(_name).save(doc);
            });

        },

        updateSubItemStatus: function*(id, itemName, status) {

            var db = yield MongoClient.connect(url);



            var query = {
                '_id': new ObjectID(id)

            };

            var docs = yield db.collection(_name).find(query).toArray();

            docs.forEach(function(doc) {
                doc.items.forEach(function(item) {
                    if (item.name == itemName) {
                        item.isDone = status;
                    }
                });
                db.collection(_name).save(doc);
            });

        },


        queryItemStatus: function*(itemName, itemTag) {

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{

                    $match: {
                        status: '1RECEIVED',
                        'items.name': itemName
                            //'items.tag': itemTag
                    }

                }, {
                    $unwind: {

                        path: '$items',

                        preserveNullAndEmptyArrays: true
                    }
                }, {

                    $match: {
                        'items.name': itemName
                            //'items.tag': itemTag
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
        querySubItems: function*(itemName, itemTag) {

            var db = yield MongoClient.connect(url);

            if (itemTag == '') {
                itemTag = { $in: ['', null] }
            }

            var res = yield db.collection(_name).aggregate([{

                    $match: { status: '1RECEIVED', 'items.name': itemName } //, 'items.tag': itemTag , 'items.name': itemName

                }, {
                    $unwind: {

                        path: '$items',

                        preserveNullAndEmptyArrays: true
                    }
                }, {

                    $match: {
                        'items.name': itemName
                            // 'items.tag': itemTag
                    }

                }, {
                    $project: { client: 1, createDate: 1, status: 1, name: '$items.name', quantity: '$items.quantity', note: '$items.note', isDone: '$items.isDone' }
                }

            ], { cursor: { batchSize: 1 } }).toArray();

            return res;

        },

        updateItemTag: function*(itemName, oldTag, newTag) {

            if (newTag == oldTag) return;

            var db = yield MongoClient.connect(url);

            var query = {
                'status': '1RECEIVED',
                'items': {
                    $elemMatch: {
                        name: itemName
                    }
                }
            };

            var docs = yield db.collection(_name).find(query).toArray();

            for (var i = 0; i < docs.length; i++) {

                docs[i].items.forEach(function(item) {
                    if (item.name == itemName) {
                        item.tag = newTag;
                    }
                });
                db.collection(_name).save(docs[i]);

            }


        }
    };
}
exports.Collection = Collection;
