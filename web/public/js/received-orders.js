define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;


    var OrderModel = function(order) {
        var self = this;
        self._id = ko.observable(order && order._id ? order._id : '');
        self.client = ko.observable(order && order.client ? order.client : '');
        self.rate = order && order.rate ? order.rate : null;
        self.items = ko.observableArray(order && Array.isArray(order.items) ? order.items : [{
            name: '',
            quantity: 1,
            note: ''
        }]);
        self.createDate = order && order.createDate ? order.createDate : '';
        self.status = order && order.status ? order.status : 'RECEIVED';

    };

    var OrdersModel = function(orders, swiper) {

        function init(orders) {

            var observableOrders = [];

            orders.forEach(function(order) {

                observableOrders.push(new OrderModel(order));

            })

            return observableOrders;
        }

        var self = this;

        var observableOrders = init(orders);

        self.orders = ko.observableArray(observableOrders);

        self.setOrders = function(orders) {

            self.orders(init(orders));

        }

        self.addItem = function(data) {

            data.items.unshift({
                name: "",
                quantity: 1,
                note: '',
                buyPrice: '',
                sellPrice: '',
                isDone: false
            });
            swiper.update();
        };

        self.removeItem = function(parent, data) {
            parent.items.remove(data);
            swiper.update();
        };

        self.submitOrder = function(order) {

            console.log('post request....');

            var orderData = ko.mapping.toJS(order); //$.parseJSON(ko.toJSON(order));

            $.post('/order', orderData, function(data, status) {

                    console.log('get post result');
                    ko.mapping.fromJS(data, {}, order);
                },
                'json'
            );

            return false;

        };

        self.addOrder = function(data) {

            var order = new OrderModel();

            self.orders.unshift(order);
            swiper.update();
        };

        self.removeOrder = function(order) {
            var id = order._id();
            self.orders.remove(order);


            if (id == '') {
                swiper.update();

                return;
            }

            $.ajax('./order/' + id, {
                success: function(data, status) {

                    console.log(data);

                },
                dataType: 'json',
                type: 'DELETE'

            });
            swiper.update();


        };

        var orders = null;
        self.searchOrders = function(data, event) {

            var keywords = $(event.target).val();
            if (orders == null) {
                orders = self.orders();
            }

            var searchedOrders = orders.filter(function(order) {

                return order.client().indexOf(keywords) >= 0;
            });

            self.orders(searchedOrders);
            swiper.update();


        };

    };



    return OrdersModel;

    //var ordersModel = new OrdersModel(<%- JSON.stringify(orders) %>);

    //ko.applyBindings(ordersModel);


})
