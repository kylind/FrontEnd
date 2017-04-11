require(['common', 'Products'], function(util, ProductsModel) {
    var $ = util.$;
    var ko = util.ko;
    ko.mapping = util.mapping;

    // var products = [
    //     { _id: 'a', name: 'itemA', sellPrice: 8, buyPrice: 8, status: '0' },
    //     { _id: 'b', name: 'itemB', sellPrice: 8, buyPrice: 8, status: '0' },
    //     { _id: 'c', name: 'itemC', sellPrice: 8, buyPrice: 8, status: '0' },
    //     { _id: 'd', name: 'itemD', sellPrice: 8, buyPrice: 8, status: '0' }
    // ];

    util.initTapEvent({
        updateAllData: null,
        updateCurrentData: null,
        setViewModelStatus: null,
        swiper: null

    })

    var productsModel = new ProductsModel(products);

    ko.applyBindings(productsModel, $('#products')[0]);

})
