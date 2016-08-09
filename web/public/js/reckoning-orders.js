define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;

    var Item = function(item) {
        var self = this;


        self.name = item && item.name ? item.name : '';
        self.quantity = item && item.quantity ? item.quantity : '1';
        self.buyPrice = item && item.buyPrice ? item.buyPrice : '';
        self.sellPrice = item && item.sellPrice ? item.sellPrice : '';
        self.profit = item && item.profit ? item.profit : '';
        self.note = item && item.note ? item.note : '';
        self.isDone = item && item.isDone ? item.isDone : false;
        self.historicTrades = ko.observableArray([]);

        self.isHistoricTradesOpen = false;

    }

    var OrderModel = function(order, swiper) {
        var self = this;

        self._id = ko.observable(order ? order._id : '');
        self.client = ko.observable(order ? order.client : '');
        self.postage = ko.observable(order && order.postage ? order.postage : 0);


        var observableItems = [];

        if (order && $.isArray(order.items) && order.items.length > 0) {
            order.items.forEach(function(item) {
                observableItems.push(new Item(item));
            });

        } else {
            observableItems.push(new Item());
        }


        self.items = ko.observableArray(observableItems);

        self.addresses = ko.observableArray(order ? order.addresses : [{
            _id: '',
            client: order ? order.client : '',
            recipient: '',
            address: '',
            phone: ''
        }]); //to do

        self.createDate = ko.observable(order ? order.createDate : '');
        self.displayDate = ko.observable(order ? order.displayDate : '');


        self.rate = order ? order.rate : '';

        self.buyPrice = ko.observable(order ? order.buyPrice : '');
        self.sellPrice = ko.observable(order ? order.sellPrice : '');
        self.profit = ko.observable(order ? order.profit : '');

        self.total = ko.pureComputed(function() {
            var sellPrice = parseFloat(this.sellPrice());
            var postage = parseFloat(this.postage());
            if (isNaN(sellPrice) || isNaN(postage)) {
                return '?';
            } else {
                return (sellPrice + postage).toFixed(1);
            }
        }, self);


        var dateFormatting = {
            month: "2-digit",
            day: "numeric",
            weekday: "short"
        };


        /*self.displayDate = function() {

            var createDate = self.createDate()

            return createDate ? new Date(createDate).toLocaleDateString("en-US", dateFormatting) : '';

        };*/

        self.status = ko.observable(order ? order.status : 'RECEIVED');

        self.orderStatus = ko.pureComputed(function() {
            if (self.status() == 'DONE') {
                return 'font-green';
            } else if (self.status() == 'SENT') {
                return 'font-yellow';
            }
        });

        self.getHistoricTrades = function(item, parent, event) {

            var itemData = ko.mapping.toJS(item);

            var $historicTrades = $(event.target).parent().next('.historicbox');

            if (!item.isHistoricTradesOpen) {
                arguments[3]();
                var succeed = arguments[4]

                if (itemData.name == '') return;

                $.getJSON('./historictrades', { 'itemName': itemData.name }, function(res, status) {

                    status == 'success' ? item.historicTrades(res) : item.historicTrades([]);

                    $historicTrades.slideDown('fast', function() {
                        item.isHistoricTradesOpen = true;
                        swiper.update();
                        succeed();
                    });

                });

            } else {

                $historicTrades.slideUp('fast', function() {
                    item.isHistoricTradesOpen = false;
                    swiper.update();
                });
            }
        };

        self.hasHistoricTrades = function(item) {

            return item.historicTrades().length > 0 ? true : false;

        };

        self.addItem = function() {

            self.items.unshift(new Item());
            swiper.update();
        };

        self.removeItem = function(item) {
            self.items.remove(item);
            swiper.update();
        };



        self.addAddress = function(address) {

            self.addresses.unshift({
                _id: "",
                client: self.client(),
                recipient: "",
                address: "",
                phone: ""
            });
            swiper.update();

        };

        self.getAddresses = function(order) {
            arguments[3]();
            var succeed = arguments[4];

            var client = order.client();

            if (client == '') return;

            $.getJSON('./addressesByClient', {
                client: client
            }, function(res, status) {

                status == 'success' ? order.addresses(res) : order.addresses([]);
                swiper.update();
                succeed();

            });


        };

        var removedAddresses = [];

        self.removeAddress = function(address) {

            if (address._id != '') {

                removedAddresses.push(address._id);

            }

            self.addresses.remove(address);
            swiper.update();


        };

        self.submitAddresses = function(order) {
            arguments[3]();
            var succeed = arguments[4];

            var addressesData = ko.mapping.toJS(order.addresses);


            $.post('./addresses', {
                    "client": order.client,
                    "addresses": addressesData
                }, function(addresses, status) {

                    order.addresses(addresses);
                    swiper.update();
                    succeed();
                },
                'json'
            );

            return false;

        };

        self.markDone = function() {
            arguments[3]();
            var succeed = arguments[4];
            var parent = arguments[1];
            var id = self._id();

            var orderStatus = self.status();

            var newStatus = 'RECEIVED';

            if (orderStatus == 'RECEIVED') {
                newStatus = 'SENT'

            } else if (orderStatus == 'SENT') {
                newStatus = 'DONE'

            }

            $.ajax('./orderStatus/' + id, {
                success: function(data, status) {

                    self.status(newStatus)
                    if (newStatus == 'DONE') {
                        parent.removeDoneOrder(self)
                    } else if (orderStatus == 'DONE') {
                        parent.addExistingOrder(self)

                    }
                    swiper.update();
                    succeed();

                },
                data: {
                    'status': newStatus
                },
                dataType: 'json',
                type: 'PUT'

            });

        }

        self.submitOrder = function(order) {
            arguments[3]();
            var succeed = arguments[4];

            var orderData = $.parseJSON(ko.toJSON(order));

            $.post('./order', orderData, function(data, status) {

                    data.items.forEach(function(item) {

                        item.historicTrades = [];

                    });

                    console.log('get post result');
                    ko.mapping.fromJS(data, {}, order);

                    var addressesData = ko.mapping.toJS(order.addresses);

                    for (var i = 0; i < addressesData.length; i++) {
                        addressesData[i].client = order.client();
                    }

                    $.post('./addresses', {
                            "client": order.client(),
                            "addresses": addressesData,
                            "removedAddresses": removedAddresses
                        }, function(addresses, status) {

                            order.addresses(addresses);
                            swiper.update();
                            succeed();
                        },
                        'json'
                    );

                },
                'json'
            );

            return false;

        };

    };



    var OrdersModel = function(orders, swiper) {


        var self = this;


        self.getObservableOrders = function(orders) {
            var observableOrders = [];

            orders.forEach(function(order) {

                observableOrders.push(new OrderModel(order, swiper));

            })
            return observableOrders;

        };

        var observableOrders = self.getObservableOrders(orders);

        self.orders = ko.observableArray(observableOrders);

        self.toggleClientView = function(data, parent, event) {

            $(event.target).toggleClass('icon-eyeslash');


            var $orders = $('#reckoningOrders').find('.orders');

            if ($(event.target).hasClass('icon-eyeslash')) {
                $orders.addClass("isClientView");

            } else {
                $orders.removeClass("isClientView");
            }


        };


        self.addOrder = function() {

            var order = new OrderModel(null, swiper);

            self.orders.unshift(order);
            swiper.update();
        };
        self.addExistingOrder = function(order) {
            if (orders != null) {
                orders.push(order);

            }
            //self.orders.push(order);

        };
        self.removeDoneOrder = function(doneOrder) {

            var id=doneOrder._id();

            if (orders != null) {

                var newOrders=orders.filter(function(order){

                    return order._id()!=id;

                });

                orders=newOrders;

            }

            self.orders.remove(doneOrder);


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
            if (orders == null) {
                orders = self.orders();
            }

            var keywords = $(event.target).val();

            var regex = /(\s*)([\u4E00-\u9FA5\uF900-\uFA2D\w]+)/;


            var matchedRes = keywords.match(regex);

            if (matchedRes != null) {

                if (matchedRes[1] == "") {
                    searchCurrentOrders(matchedRes[2])

                } else {
                    searchGlobalOrders(matchedRes[2])
                }

            } else if (orders != null) {

                newKeywords = '';

                self.orders(orders);
                swiper.update();
            }

        }

        function searchCurrentOrders(keywords) {


            var searchedOrders = orders.filter(function(order) {

                return order.client().indexOf(keywords) >= 0;
            });

            self.orders(searchedOrders);
            swiper.update();
        }

        var timeoutIds = [];

        var newKeywords = '';

        function searchGlobalOrders(keywords) {

            newKeywords = keywords;

            var id = setTimeout(function() {


                for (var i = 1; i < timeoutIds.length; i++) {
                    clearTimeout(timeoutIds[i]);
                }

                timeoutIds = [];

                if (newKeywords != '') {

                    $.ajax('./ordersByName', {
                        data: {
                            client: newKeywords
                        },
                        type: 'GET',
                        success: function(data, status) {

                            self.orders(self.getObservableOrders(data));
                            swiper.update();

                        },

                        dataType: 'json'

                    });



                }

                console.log('i am searching ' + newKeywords);

            }, 1000);

            timeoutIds.push(id);


        }


    };

    return OrdersModel;


})
