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

    var OrderModel = function(order) {
        var self = this;

        self._id = ko.observable(order ? order._id : '');
        self.client = ko.observable(order ? order.client : '');


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

        self.rate = order ? order.rate : '';

        self.buyPrice = ko.observable(order ? order.buyPrice : '');
        self.sellPrice = ko.observable(order ? order.sellPrice : '');
        self.profit = ko.observable(order ? order.profit : '');


        var dateFormatting = {
            month: "2-digit",
            day: "numeric",
            weekday: "short"
        };


        self.displayDate = function() {

            var createDate = self.createDate()

            return createDate ? new Date(createDate).toLocaleDateString("en-US", dateFormatting) : '';

        };

        self.status = ko.observable(order ? order.status : 'RECEIVED');

        self.getHistoricTrades = function(item, event) {
            var itemData = ko.mapping.toJS(item);

            var $historicTrades = $(event.target).parent().next('.historicbox');

            if (!item.isHistoricTradesOpen) {

                if (itemData.name == '') return;

                $.getJSON('./historictrades/' + itemData.name, function(res, status) {

                    status == 'success' ? item.historicTrades(res) : item.historicTrades([]);

                    $historicTrades.slideDown('fast', function() {
                        item.isHistoricTradesOpen = true;
                    });

                });

            } else {

                $historicTrades.slideUp('fast', function() {
                    item.isHistoricTradesOpen = false;
                });
            }
        };
        self.hasHistoricTrades = function(item) {

            return item.historicTrades().length > 0 ? true : false;

        };

        self.addItem = function() {

            self.items.unshift(new Item());
        };

        self.removeItem = function(item) {
            self.items.remove(item);
        };



        self.addAddress = function(address) {

            self.addresses.unshift({
                _id: "",
                client: self.client(),
                recipient: "",
                address: "",
                phone: ""
            });

        };

        self.getAddresses = function(order) {

            var client = order.client();

            if (client == '') return;


            $.getJSON('./addressesByClient', {
                client: client
            }, function(res, status) {

                status == 'success' ? order.addresses(res) : order.addresses([]);

            });


        };

        var removedAddresses = [];

        self.removeAddress = function(address) {

            if (address._id != '') {

                removedAddresses.push(address._id);

            }

            self.addresses.remove(address);


        };

        self.submitAddresses = function(order) {

            var addressesData = ko.mapping.toJS(order.addresses);


            $.post('./addresses', {
                    "client": order.client,
                    "addresses": addressesData
                }, function(addresses, status) {

                    order.addresses(addresses);
                },
                'json'
            );

            return false;

        };

        self.markDone = function() {
            var id = self._id();

            var orderStatus = self.status() == 'RECEIVED' ? 'DONE' : 'RECEIVED'

            $.ajax('./orderStatus/' + id, {
                success: function(data, status) {

                    self.status(orderStatus)

                },
                data: {
                    'status': orderStatus
                },
                dataType: 'json',
                type: 'PUT'

            });

        }

        self.submitOrder = function(order) {

            console.log('post request....');

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
                        },
                        'json'
                    );

                },
                'json'
            );

            return false;

        };

    };



    var OrdersModel = function(orders) {


        var self = this;


        self.getObservableOrders = function(orders) {
            var observableOrders = [];

            orders.forEach(function(order) {

                observableOrders.push(new OrderModel(order));

            })
            return observableOrders;

        };

        var observableOrders = self.getObservableOrders(orders);

        self.orders = ko.observableArray(observableOrders);


        self.addOrder = function() {

            var order = new OrderModel();

            self.orders.unshift(order);
        };
        self.removeOrder = function(order) {
            var id = order._id();
            self.orders.remove(order);
            if (id == '') return;

            $.ajax('./order/' + id, {
                success: function(data, status) {

                    console.log(data);

                },
                dataType: 'json',
                type: 'DELETE'

            });

        };



        var orders = null;
        self.searchOrders = function(data, event) {

            var keywords = $(event.target).val();
            if (keywords.startsWith(' ')) {
                keywords = keywords.substring(1);
                searchGlobalOrders(keywords)

            } else {
                searchCurrentOrders(keywords)
            }


        }

        function searchCurrentOrders(keywords) {
            if (orders == null) {
                orders = self.orders();
            }

            var searchedOrders = orders.filter(function(order) {

                return order.client().indexOf(keywords) >= 0;
            });

            self.orders(searchedOrders);
        }

        var timeoutIds = [];

        var newKeywords = '';

        function searchGlobalOrders(keywords) {

            if (orders == null) {
                orders = self.orders();
            }

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
