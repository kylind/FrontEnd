(function() {

    requirejs.config({

        basicUrl: '../public/js',

        paths: {
            jquery: 'jquery-2.2.3.min',
            ko: 'knockout-3.4.0',
            'ko.mapping': 'knockout.mapping.2.4.1'
        },
        shim: {
            'ko.mapping': ['./knockout-3.4.0']
        }

    });

    require(['received-orders', 'ko'], function(OrdersModel) {
        var ordersModel = new OrdersModel(orders);
        ko.applyBindings(ordersModel);

    });
})(orders);
