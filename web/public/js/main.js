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


require(['reckoning-orders', 'knockout', 'jquery'], function(OrdersModel, ko, $) {

    $.getJSON('./reckoningOrdersJson', function(orders, status) {
        var ordersModel = new OrdersModel(orders);
        ko.applyBindings(ordersModel, $('#reckoningOrders')[0]);

    })


});