define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    //ko.mapping = mapping;


    var Item = function(item) {
        var self = this;


        self.name = ko.observable(item && item.name ? item.name : '');
        self.quantity = ko.observable(item && item.quantity ? item.quantity : '1');
        self.note = ko.observable(item && item.note ? item.note : '');


        self.isChanged = false;

        self.name.subscribe(function(newValue) {
            self.isChanged = true;
        })
        self.quantity.subscribe(function(newValue) {
            self.isChanged = true;
        })

        self.note.subscribe(function(newValue) {
            self.isChanged = true;
        })




    }


    var OrderModel = function(order) {
        var self = this;
        self._id = ko.observable(order && order._id ? order._id : '');
        self.client = ko.observable(order && order.client ? order.client : '');
        self.rate = order && order.rate ? order.rate : null;



        var observableItems = [];

        if (order && $.isArray(order.items) && order.items.length > 0) {
            order.items.forEach(function(item) {
                observableItems.push(new Item(item));
            });

        } else {
            for (var i = 0; i < 3; i++) {
                observableItems.push(new Item());
            }

        }


        self.items = ko.observableArray(observableItems);

        self.isChanged = false;
        self.client.subscribe(function(newValue) {
            self.isChanged = true;
        });
        self.items.subscribe(function(newValue) {
            self.isChanged = true;
        })

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

        function sortOrders (orders){

            orders.sort(function( orderA, orderB){

                var aStatus = orderA.packingStatus();
                var bStatus = orderB.packingStatus()

                if(aStatus==bStatus){

                    return orderA.createDate <= orderB.createDate ? 1 : -1;

                }else{
                    return aStatus<bStatus ? -1: 1;
                }

            })

        }

        var self = this;

        self.setSwiper = function(mySwiper) {

            swiper = mySwiper;
            swiper.update();

        }

        var observableOrders = init(orders);

        self.orders = ko.observableArray(observableOrders);

        self.setOrders = function(orders) {

            self.orders(init(orders));
            swiper.update();


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
                    succeed(true);
                },
                'json'
            );

            return false;

        };

        self.submitOrders = function() {
            arguments[3]();
            var succeed = arguments[4];



            var orders = self.orders();
            //var ordersData = ko.mapping.toJS(orders); //$.parseJSON(ko.toJSON(order));
            var ordersData = $.parseJSON(ko.toJSON(orders))

            if (Array.isArray(ordersData) && ordersData.length > 0) {

                var changedIndexs = [];

                var changedOrders = ordersData.filter(function(order, index) {

                    var isChanged = false;
                    var isReal = order.client == '' ? false : true;

                    if (isReal) {
                        if (order.isChanged) {
                            isChanged = true;
                        } else {
                            for (var i = 0; i < order.items.length; i++) {
                                if (order.items[i].isChanged) {
                                    isChanged = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (isChanged) {
                        changedIndexs.push(index);
                    }

                    return isChanged;

                });

                if (changedOrders.length > 0) {

                    $.post('/orders', { orders: changedOrders }, function(rs, status) {


                            rs.forEach(function(newOrder, index) {
                                var orderIndex = changedIndexs[index];

                                if ($.isArray(newOrder.items) && newOrder.items.length == 0) {
                                    newOrder.items = [{}, {}, {}];
                                }

                                ko.mapping.fromJS(newOrder, {
                                    items: {
                                        create: function(option) {
                                            return new Item(option.data);

                                        }
                                    }
                                }, orders[orderIndex]);

                                orders[orderIndex].isChanged = false;




                            })

                            succeed(true);
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

            var $target = $(arguments[2].target);

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

                    if($('#search-receivedOrders').val()==''){

                        var  orders= self.orders();

                        sortOrders(orders);

                         self.orders(orders);

                    }

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
                succeed();

                return;
            }

            $.ajax('./order/' + id, {
                success: function(data, status) {

                    succeed(true);

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


            if(keywords==''){

                sortOrders(orders);

                var searchedOrders = orders;

            }else{
                var searchedOrders = orders.filter(function(order) {

                    return order.client().indexOf(keywords) >= 0;
                });
            }


            self.orders(searchedOrders);


            setTimeout(function() {
                swiper.update();
            }, 100)


        };

    };



    return OrdersModel;



})
