requirejs.config({

    basicUrl: './js',

    paths: {
        jquery: 'jquery-2.2.3.min',
        'knockout': 'knockout-3.4.0',
        'knockout.mapping': 'knockout.mapping.2.4.1',
        'swiper': 'swiper.jquery.min'

    },
    shim: {
        'swiper': ['jquery']
    }

});

var swiper

require(['received-orders', 'knockout', 'jquery', 'swiper'], function(OrdersModel, ko, $, Swiper) {

     swiper = new Swiper('.swiper-container', {
        autoHeight: true,
        spaceBetween: 30,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        paginationBulletRender: function(index, className) {
            var bulletName = '';
            switch (index) {
                case 0:

                    bulletName = 'RECEIVEING';
                    break;

                case 1:
                    bulletName = 'PURCHASE';
                    break;

                case 2:
                    bulletName = 'RECKONING';
                    break;

                case 3:
                    bulletName = 'DELIVERY';
                    break;
            }
            return '<span class="' + className + '">' + bulletName + '</span>';
        }
    });

    $.getJSON('./receivedOrdersJson', function(orders, status) {

        var ordersModel = new OrdersModel(orders, swiper);
        ko.applyBindings(ordersModel, $('#receivedOrders')[0]);
        swiper.onResize();


    });


});



require(['purchase-items', 'knockout', 'jquery'], function(ItemsModel, ko, $) {

    $.getJSON('./purchaseItemsJson', function(items, status) {
        var itemsModel = new ItemsModel(items, swiper);
        ko.applyBindings(itemsModel, $('#purchaseItems')[0]);

    })


});

require(['reckoning-orders', 'knockout', 'jquery'], function(OrdersModel, ko, $) {

    $.getJSON('./reckoningOrdersJson', function(orders, status) {
        var ordersModel = new OrdersModel(orders, swiper);
        ko.applyBindings(ordersModel, $('#reckoningOrders')[0]);

    })


});

require(['addresses', 'knockout', 'jquery'], function(AddressesModel, ko, $) {

    $.getJSON('./addressesJson', function(addresses, status) {
        var addressesModel = new AddressesModel(addresses, swiper);
        ko.applyBindings(addressesModel, $('#addresses')[0]);

    })


});
