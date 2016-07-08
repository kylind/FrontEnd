requirejs.config({

    basicUrl: './js',

    paths: {
        jquery: 'jquery-2.2.3.min',
        'knockout': 'knockout-3.4.0',
        'knockout.mapping': 'knockout.mapping.2.4.1'

    }
    /*,
            shim: {
                'ko.mapping': ['ko']
            }*/

});

require(['received-orders', 'knockout', 'jquery'], function(OrdersModel, ko, $) {

    $.getJSON('./receivedOrdersJson', function(orders, status) {
        var ordersModel = new OrdersModel(orders);
        ko.applyBindings(ordersModel, $('#receivedOrders')[0]);

    })


});
require(['purchase-items', 'knockout', 'jquery'], function(ItemsModel, ko, $) {

    $.getJSON('./purchaseItemsJson', function(items, status) {
        var itemsModel = new ItemsModel(items);
        ko.applyBindings(itemsModel, $('#purchaseItems')[0]);

    })


});

require(['reckoning-orders', 'knockout', 'jquery'], function(OrdersModel, ko, $) {

    $.getJSON('./reckoningOrdersJson', function(orders, status) {
        var ordersModel = new OrdersModel(orders);
        ko.applyBindings(ordersModel, $('#reckoningOrders')[0]);

    })


});

require(['addresses', 'knockout', 'jquery'], function(AddressesModel, ko, $) {

    $.getJSON('./addressesJson', function(addresses, status) {
        var addressesModel = new AddressesModel(addresses);
        ko.applyBindings(addressesModel, $('#addresses')[0]);

    })


});

