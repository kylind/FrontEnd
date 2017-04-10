require('Products', function(ProductsModel) {

    var products = [
    { name: 'itemA', sell: 8, buy: 8, status: '0' },
    { name: 'itemB', sell: 8, buy: 8, status: '0' },
    { name: 'itemC', sell: 8, buy: 8, status: '0' },
    { name: 'itemD', sell: 8, buy: 8, status: '0' }];

    var productsModel = new ProductsModel(products);

    ko.applyBindings(productsModel, $('#products')[0]);

})
