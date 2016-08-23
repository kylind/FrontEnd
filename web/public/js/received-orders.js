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
        self.packingStatus=   ko.observable(order && order.packingStatus ? order.packingStatus : 'ISREADY');

        self.orderPackingStatus = ko.pureComputed(function() {
            if (self.packingStatus() == 'PACKED') {
                return 'font-green';
            } else if (self.packingStatus() == 'NOTREADY') {
                return 'font-yellow';
            }else{
                return 'font-white';
            }
        });

        self.orderReadyStatus = ko.pureComputed(function() {
            if (self.packingStatus() == 'NOTREADY') {
                return 'icon-thumbsdown font-darkyellow';
            }else{
                return 'icon-thumbsup';
            }
        });

    };

    var OrdersModel = function(orders, mySwiper) {

        var swiper = mySwiper;



        function init(orders) {

            var observableOrders = [];

            orders.forEach(function(order) {

                observableOrders.push(new OrderModel(order));

            })

            return observableOrders;
        }

        var self = this;

        self.setSwiper = function(mySwiper) {

            swiper = mySwiper;

        }

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

        self.removeItem = function(data, parent) {
            parent.items.remove(data);
            swiper.update();
        };

        self.submitOrder = function(order) {
            arguments[3]();
            var succeed = arguments[4];

            console.log('post request....');

            var orderData = ko.mapping.toJS(order); //$.parseJSON(ko.toJSON(order));

            $.post('/order', orderData, function(data, status) {

                    console.log('get post result');
                    ko.mapping.fromJS(data, {}, order);
                    succeed();
                },
                'json'
            );

            return false;

        };



        self.markPackingStatus = function(order) {
            arguments[3]();
            var succeed = arguments[4];
            var parent = arguments[1];
            var id = order._id();

            var packingStatus = order.packingStatus()

             $target = $(arguments[2].target);

             var newStatus = '';

             if($target.hasClass('icon-leaf')){
                if(packingStatus=="ISREADY"){
                    newStatus = 'PACKED';
                }else if(packingStatus=="PACKED"){
                    newStatus = 'ISREADY';
                }
             }else{
                if(packingStatus=="ISREADY" || packingStatus=="PACKED"){
                    newStatus = 'NOTREADY';
                }else{
                    newStatus = 'ISREADY';
                }
             }


            if(newStatus==""){
                succeed();
                return;
            }

            $.ajax('./packingStatus/' + id, {
                success: function(data, status) {

                    order.packingStatus(newStatus)
                    succeed();

                },
                data: {
                    'packingStatus': newStatus
                },
                dataType: 'json',
                type: 'PUT'

            });

        };

        self.addOrder = function() {

            var order = new OrderModel();

            self.orders.unshift(order);
            swiper.update();
            $(window).scrollTop(0);
        };

        self.removeOrder = function(order) {

            arguments[3]();
            var succeed = arguments[4];

            var id = order._id();
            self.orders.remove(order);


            if (id == '') {
                swiper.update();
                succeed();

                return;
            }

            $.ajax('./order/' + id, {
                success: function(data, status) {

                    succeed();

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
