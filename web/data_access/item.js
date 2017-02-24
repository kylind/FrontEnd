var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:27017/orders';




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
                            'tag': '$items.tag',
                            'isDone': '$items.isDone'
                        },
                        'quantity': {
                            $sum: '$items.quantity'
                        }
                    }
                }, {
                    $group: {
                        '_id': {
                            'name': '$_id.name',
                            'tag': '$_id.tag',
                        },
                        'purchaseDetail': {
                            $push: {
                                'isDone': '$_id.isDone',
                                'quantity': '$quantity'
                            }
                        },
                        'quantity': {
                            $sum: '$quantity'
                        }
                    }, {

                    $project: { '_id': '$_id.name', tag: '$_id.tag', quantity:1,  purchaseDetail: 1 }

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

        updateItemStatus: function*(itemName,itemTag, status) {

            var db = yield MongoClient.connect(url);


            /*            var res = yield db.collection(_name).updateMany({
                            'items.name': itemName

                        }, {
                            $set: {
                                'items.$.isDone': status
                            }
                        });*/


            var query = {
                'items': {
                    $elemMatch: {
                        name: itemName,
                        tag:itemTag,
                        isDone: !status

                    }
                }

            };

            var docs = yield db.collection(_name).find(query).toArray();
            var count = docs.length;

            while (count > 0) {


                var res = yield db.collection(_name).updateMany(query, {
                    $set: {
                        'items.$.isDone': status
                    }
                });

                docs = yield db.collection(_name).find(query).toArray();
                count = docs.length;

            }



            return res;

        },

        updateSubItemStatus: function*(id, itemName, status) {

            var db = yield MongoClient.connect(url);


            /*            var res = yield db.collection(_name).updateMany({
                            '_id': new ObjectID(id),
                            'items.name': itemName

                        }, {
                            $set: {
                                'items.$.isDone': status
                            }
                        });*/



            var query = {
                '_id': new ObjectID(id),
                'items': {
                    $elemMatch: {
                        name: itemName,
                        isDone: !status
                    }
                }

            };

            var docs = yield db.collection(_name).find(query).toArray();
            var count = docs.length;

            while (count > 0) {


                var res = yield db.collection(_name).updateOne(query, {
                    $set: {
                        'items.$.isDone': status
                    }
                });

                docs = yield db.collection(_name).find(query).toArray();
                count = docs.length;

            }


            return res;

        },


        queryItemStatus: function*(itemName,itemTag) {

            var db = yield MongoClient.connect(url);

            var res = yield db.collection(_name).aggregate([{

                    $match: {
                        status: '1RECEIVED',
                        'items.name': itemName,
                        'items.tag':itemTag
                    }

                }, {
                    $unwind: {

                        path: '$items',

                        preserveNullAndEmptyArrays: true
                    }
                }, {

                    $match: {
                        'items.name': itemName,
                        'items.tag': itemTag
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

            var res = yield db.collection(_name).aggregate([{

                    $match: { status: '1RECEIVED', 'items.name': itemName,, 'items.tag': itemTag }

                }, {
                    $unwind: {

                        path: '$items',

                        preserveNullAndEmptyArrays: true
                    }
                }, {

                    $match: { 'items.name': itemName }
                    $match: { 'items.tag': itemTag }

                }, {
                    $project: { client: 1, createDate: 1, status: 1, name: '$items.name', quantity: '$items.quantity', note: '$items.note', isDone: '$items.isDone' }
                }

            ], { cursor: { batchSize: 1 } }).toArray();

            return res;

        },

        updateItemTag: function*(itemName, oldTag,newTag) {

            var db = yield MongoClient.connect(url);


            var query = {
                'items': {
                    $elemMatch: {
                        name: itemName,
                        tag: oldTag
                    }
                }

            };

            var docs = yield db.collection(_name).find(query).toArray();
            var count = docs.length;

            while (count > 0) {


                var res = yield db.collection(_name).updateMany(query, {
                    $set: {
                        'items.$.tag': newTag
                    }
                });

                docs = yield db.collection(_name).find(query).toArray();
                count = docs.length;

            }



            return res;

        },
    };
}
exports.Collection = Collection;
