require(['common', 'Products'], function(util, ProductsModel) {

    var $ = util.$;
    var ko = util.ko;
    var mapping = util.mapping;
    var Swiper = util.Swiper;


    util.initTapEvent({
        updateAllData: function() {},
        updateCurrentData: function() {},
        setViewModelStatus: function() {},
        swiper: {}

    })
    var productsModel = new ProductsModel(products);

    ko.applyBindings(productsModel, $('#products')[0]);

})
