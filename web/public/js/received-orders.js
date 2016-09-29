define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;

    var OrderModel = function(order) {
        var self = this;
        self._id = ko.observable(order && order._id ? order._id : '');
        self.client = ko.observable(order && order.client ? order.client : '');
        self.rate = order && order.rate ? order.rate : null;
        self.items = ko.observableArray(order && Array.isArray(order.items)&&order.items.length>0 ? order.items : [{
            name: '',
            quantity: 1,
            note: ''
        }, {
            name: '',
            quantity: 1,
            note: ''
        }, {
            name: '',
            quantity: 1,
            note: ''
        }]);
        self.createDate = order && order.createDate ? order.createDate : '';
        self.status = order && order.status ? order.status : '1RECEIVED';
        self.packingStatus = ko.observable(order && order.packingStatus ? order.packingStatus : '1ISREADY');

        self.orderPackingStatus = ko.pureComputed(function() {
            if (self.packingStatus() == '3PACKED') {
                return 'font-green';
            } else if (self.packingStatus() == '2NOTREADY') {
                return 'font-yellow';
            } else {
                return 'font-black';
            }
        });

        self.orderReadyStatus = ko.pureComputed(function() {
            if (self.packingStatus() == '2NOTREADY') {
                return 'icon-thumbsdown font-yellow';
            } else {
                return 'icon-thumbsup font-black';
            }
        });


    };

    var OrdersModel = function(orders, mySwiper) {

        var swiper = mySwiper;



        function init(orders) {

            var observableOrders = [];

            if (Array.isArray(orders) && orders.length > 0) {
                orders.forEach(function(order) {

                    observableOrders.push(new OrderModel(order));

                })
            } else {

                for (var i = 0; i < 30; i++) {
                    observableOrders.push(new OrderModel());

                }

            }



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

        self.submitOrders = function() {
             arguments[3]();
             var succeed = arguments[4];


            var ordersData = ko.mapping.toJS(self.orders()); //$.parseJSON(ko.toJSON(order));

            if (Array.isArray(ordersData) && ordersData.length > 0) {

                var realOrders = ordersData.filter(function(order) {
                    return order.client == '' ? false : true;
                })

                $.post('/orders', { orders: realOrders }, function(data, status) {
                        self.setOrders (data);
                        succeed();
                    },
                    'json'
                );
            }

            return false;





            var ordersData = $.parseJSON(ko.toJSON(self.orders())); //$.parseJSON(ko.toJSON(order));

            if (Array.isArray(ordersData) && ordersData.length > 0) {

                var changedOrders = ordersData.filter(function(order) {

                    // var isReal = order.client == '' ? false : true;

                    //if (isReal) {
                    if (order.isChanged) {
                        return true
                    } else {
                        var isChanged = false;
                        for (var i = 0; i < order.items.length; i++) {
                            if (order.items[i].isChanged) {
                                isChanged = true;
                                break;
                            }

                        }
                        return isChanged;
                    }

                    // } else {
                    //     return false;
                    // }

                })

                if (changedOrders.length > 0) {
                    $.post('/orders', { orders: changedOrders }, function(data, status) {


                            self.orders().forEach(function(order) {


                                var newOrder = data.find(function(newOrder) {
                                    return newOrder._id == order._id();
                                })

                                if (newOrder) {
                                    newOrder.items.forEach(function(item) {
                                        item.historicTrades = [];
                                    });
                                    ko.mapping.fromJS(newOrder, {}, order);
                                }

                            })

                            succeed();
                        },
                        'json'
                    );
                } else {
                    succeed();
                }


            }


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

            if ($target.hasClass('icon-leaf')) {
                if (packingStatus == "1ISREADY") {
                    newStatus = '3PACKED';
                } else if (packingStatus == "3PACKED") {
                    newStatus = '1ISREADY';
                }
            } else {
                if (packingStatus == "1ISREADY" || packingStatus == "3PACKED") {
                    newStatus = '2NOTREADY';
                } else {
                    newStatus = '1ISREADY';
                }
            }


            if (newStatus == "") {
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


            setTimeout(function() {
                swiper.update();
            }, 100)


        };

    };



    return OrdersModel;



})
