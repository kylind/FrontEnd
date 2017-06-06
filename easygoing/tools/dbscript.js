var historicProducts = db.xumin_orders.aggregate([{
    $unwind: {

        path: '$items',

        preserveNullAndEmptyArrays: true
    }
}, {
    $match: {
        'items.buyPrice': { $nin: [null, ''] }
        'items.sellPrice': { $nin: [null, ''] }

    }

}, {
    $group: {
        '_id': '$items.name',

        'buyPrice': { $last: '$items.buyPrice' },
        'sellPrice': { $last: '$items.sellPrice' }
    }
}, {
    $addFields: {
        'status': 'IMPORT',
        'modifiedDate': new Date()
    }
}, {
    $project: { '_id': 0, name: '$_id', buyPrice: 1, sellPrice: 1, status: 1, modifiedDate: 1 }
}]).sort({ 'name': 1 }).toArray();


var products = db.xumin_products.find().toArray();


historicProducts.forEach(function(historicProduct) {

    var product = products.find(product => product.name == historicProduct.name);

    if (product && (product.sellPrice != historicProduct.sellPrice || product.buyPrice != historicProduct.buyPrice)) {

        product.sellPrice = historicProduct.sellPrice;
        product.buyPrice = historicProduct.buyPrice;
        if (product.status == 'MANUAL' || product.status == 'MODIFIED') {
            product.status = 'OVERRIDE';
        }

        db.xumin_products.save(product);

    } else {
        db.xumin_products.save(historicProduct);
    }

});








let newClients = db.orders.aggregate([{
    $group: {
        '_id': '$client'

    }
}, {

    $lookup: {
        from: 'zhuqin_clients',
        localField: "_id",
        foreignField: "name",
        as: "clientInfo"
    }

}, {
    $match: {
        clientInfo: { $size: 0 }
    }
}, {
    $addFields: {
        'addresses': [],
        'createDate': new Date()
    }
}, {
    $project: { '_id': 0, name: '$_id', createDate: 1, 'addresses': 1 }
}], {
    cursor: {
        batchSize: 1
    }
}).toArray();


newClients.forEach(function(client) {

    db.zhuqin_clients.save(client);

});
