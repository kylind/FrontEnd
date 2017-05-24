var historicProducts = db.orders.aggregate([{
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
    $project: { name: '$_id', buyPrice: 1, sellPrice: 1 }
}]).sort({ 'name': 1 }).toArray();


var products = db.products.find().toArray();


historicProducts.forEach(function(historicProduct) {

    var product = products.find(product => product.name == historicProduct.name);

    if (product && product.sellPrice != historicProduct.sellPrice || product.buyPrice != historicProduct.buyPrice) {

        product.sellPrice = historicProduct.sellPrice;
        product.buyPrice = historicProduct.buyPrice;
        if (product.status == 'MANUAL' || product.status == 'MODIFIED') {
            product.status = 'OVERRIDE';
        }

        db.products.save(product);

    } else {
        db.products.save(historicProduct);
    }

});
