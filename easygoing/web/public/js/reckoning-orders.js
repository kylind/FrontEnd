define(['common'], function(util) {

    var $ = util.$;
    var ko = util.ko;
    ko.mapping = util.mapping;


    function getDoneOrderStartDate() {

        var currentMiliSeconds = Date.now();

        var currentDay = new Date().getDay();

        var startMiliSeconds = currentMiliSeconds - ((currentDay + 7) * 24 * 60 * 60 * 1000);

        var startDate = new Date(new Date(startMiliSeconds).setHours(0, 0, 0, 0));

        return startDate;
    }

    var Item = function(item) {
        var self = this;


        self.name = ko.observable(item && item.name ? item.name : '');
        self.quantity = ko.observable(item && item.quantity ? item.quantity : '1');
        self.buyPrice = ko.observable(item && !isNaN(item.buyPrice) ? item.buyPrice : '');
        self.sellPrice = ko.observable(item && !isNaN(item.sellPrice) ? item.sellPrice : '');
        self.profit = item && item.profit ? item.profit : '';
        self.note = item && item.note ? item.note : '';
        self.isDone = item && item.isDone ? item.isDone : false;
        self.tag= item && item.tag ? item.tag : '';

        self.historicTrades = ko.observableArray([]);

        self.isHistoricTradesOpen = false;

        self.isChanged = false;

        self.name.subscribe(function(newValue) {
            self.isChanged = true;
        })
        self.quantity.subscribe(function(newValue) {
            self.isChanged = true;
        })
        self.buyPrice.subscribe(function(newVal) {
            self.isChanged = true;
        })
        self.sellPrice.subscribe(function(newVal) {
            self.isChanged = true;
        })

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
            for (var i = 0; i < 3; i++) {
                observableItems.push(new Item());
            }

        }

        self.isChanged = false;

        self.items = ko.observableArray(observableItems);

        self.items.subscribe(function(newValue) {
            self.isChanged = true;


        })
        self.client.subscribe(function(newValue) {

            self.isChanged = true;

        })
        self.postage.subscribe(function(newValue) {
            self.isChanged = true;


        })



        self.createDate = ko.observable(order ? order.createDate : '');
        self.displayDate = ko.observable(order ? order.displayDate : '');



        self.rate = order ? order.rate : '';

        self.buyPrice = ko.observable(order && order.buyPrice ? order.buyPrice : '');
        self.sellPrice = ko.observable(order && order.sellPrice ? order.sellPrice : '');
        self.profit = ko.observable(order && order.profit ? order.profit : '');
        self.isComplete = ko.observable(order && order.isComplete ? order.isComplete : false);

        self.formatPrice = function(price) {

            if (!price) return '?';

            var purePrice = price();
            if (purePrice) {
                return (+purePrice).toFixed(1);
            } else {
                return '?'
            }
        }


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

        self.status = ko.observable(order ? order.status : '1RECEIVED');

        self.packingStatus = order ? order.packingStatus : '1ISREADY';

        self.orderStatus = ko.pureComputed(function() {
            if (self.status() == '3DONE') {
                return 'font-green';
            } else if (self.status() == '2SENT') {
                return 'font-yellow';
            }
        });

        self.getHistoricTrades = function(item, parent, event) {

            var itemData = ko.mapping.toJS(item);

            var $historicTrades = $(event.target).closest('.item').find('.historicbox');

            if (!item.isHistoricTradesOpen) {

                var succeed = arguments[4]

                if (itemData.name == '') return;

                arguments[3]();

                $.getJSON('./historictrades', {
                    'itemName': itemData.name
                }, function(res, status) {

                    status == 'success' ? item.historicTrades(res) : item.historicTrades([]);


                    $historicTrades.slideDown('fast', function() {
                        item.isHistoricTradesOpen = true;

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

                    succeed();
                },
                'json'
            );

            return false;

        };


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


                },
                'json'
            );

            return false;

        };


    };



    var OrdersModel = function(orders, swiper) {


        var self = this;

        var startDate = getDoneOrderStartDate();


        self.updateReservedOrders = function (orders) {

            reservedOrders = orders;

        }

        self.sortOrders = function(orders) {

            orders.sort(function(orderA, orderB) {

                var aStatus = orderA.status();
                var bStatus = orderB.status()

                if (aStatus == bStatus) {

                    return orderA.createDate() <= orderB.createDate() ? 1 : -1;

                } else {
                    return aStatus < bStatus ? -1 : 1;
                }

            })

        }

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


            var $orders = $('.orders--reckoning');

            if ($(event.target).hasClass('icon-eyeslash')) {
                $orders.addClass("isClientView");

            } else {
                $orders.removeClass("isClientView");
            }

            swiper.update();


        };

        self.markDone = function(order) {
            arguments[3]();
            var succeed = arguments[4];
            var parent = arguments[1];
            var id = order._id();

            var orderStatus = order.status();

            var newStatus = '1RECEIVED';

            if (orderStatus == '1RECEIVED') {
                newStatus = '2SENT'

            } else if (orderStatus == '2SENT') {
                newStatus = '3DONE'

            }

            $.ajax('./orderStatus/' + id, {
                success: function(data, status) {

                    order.status(newStatus)

                    var orders = self.orders();

                    if ($('#search-reckoningOrders').val() == '') {

                        if (newStatus == '3DONE' && order.createDate() < startDate) {
                            self.removeDoneOrder(order)

                        }

                        //  else if (orderStatus == '3DONE' && self.createDate() < startDate) {
                        //     self.addExistingOrder(self)

                        // }

                        self.sortOrders(orders);

                        self.orders(orders);

                        self.updateReservedOrders(orders);

                    }else{
                        needRefresh=true;
                    }




                    succeed();

                },
                data: {
                    'status': newStatus
                },
                dataType: 'json',
                type: 'PUT'

            });

        }


        self.submitOrders = function() {
            arguments[3]();
            var succeed = arguments[4];

            var orders = self.orders();
            var ordersData = $.parseJSON(ko.toJSON(orders)); //$.parseJSON(ko.toJSON(order));

            if (Array.isArray(ordersData) && ordersData.length > 0) {

                var changedIndexs = [];

                var changedOrders = ordersData.filter(function(order, index) {

                    var isChanged = false;

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

                    if (isChanged) {
                        changedIndexs.push(index);
                    }

                    return isChanged;

                })

                if (changedOrders.length > 0) {
                    $.post('./orders', {
                            orders: changedOrders
                        }, function(rs, status) {

                            rs.forEach(function(newOrder, index) {
                                var orderIndex = changedIndexs[index];

                                if ($.isArray(newOrder.items) && newOrder.items.length == 0) {
                                    newOrder.items = [{}, {}, {}];
                                }

                                newOrder.items.forEach(function(item) {
                                    item.historicTrades = [];
                                });

                                ko.mapping.fromJS(newOrder, {
                                    items: {
                                        create: function(option) {
                                            return new Item(option.data);

                                        }
                                    }
                                }, orders[orderIndex]);

                                orders[orderIndex].isChanged = false;
                                // orders[orderIndex].items().forEach(function(item){
                                //     item.isChanged=false;

                                // })

                            })

                            succeed();

                        },
                        'json'
                    );
                } else {
                    succeed();
                }


            }

            if ($('#search-reckoningOrders').val() != '') {

                needRefresh=true;
            }


            return false;

        };

        self.addOrder = function() {


            var order = new OrderModel(null, swiper);

            self.orders.unshift(order);

            self.updateReservedOrders(self.orders());

            swiper.update();
            $(window).scrollTop(0);
        };
        self.addExistingOrder = function(order) {
            // if (reservedOrders != null) {

            //     var existingOrder = reservedOrders.find(function(ele) {
            //         return ele._id == order._id;
            //     });

            //     if (!existingOrder) {
            //         reservedOrders.unshift(order);
            //     }

            // }



            self.orders.push(doneOrder);



        };
        self.removeDoneOrder = function(doneOrder) {

            // var id = doneOrder._id();

            // if (reservedOrders != null) {

            //     var newOrders = reservedOrders.filter(function(order) {

            //         return order._id() != id;

            //     });

            //     reservedOrders = newOrders;

            // }



            self.orders.remove(doneOrder);


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

                    succeed();


                },
                dataType: 'json',
                type: 'DELETE'

            });

            self.updateReservedOrders(self.orders());

            swiper.update();

        };



        var reservedOrders = null;
        var needRefresh= false;
        self.searchOrders = function(data, event) {


            var keywords = $(event.target).val();

            var regex = /(\s*)([\u4E00-\u9FA5\uF900-\uFA2D\w]+[\u4E00-\u9FA5\uF900-\uFA2D\w ]*)/;


            var matchedRes = keywords.match(regex);

            if (reservedOrders == null) {

                reservedOrders = self.orders();

            }

            // if (matchedRes == null) {
            //     self.sortOrders(reservedOrders);

            //     self.orders(reservedOrders);
            // }

            if (matchedRes != null) {

                if (matchedRes[1] == "") {
                    searchCurrentOrders(matchedRes[2])

                } else {
                    searchGlobalOrders(matchedRes[2])
                }

            } else if (needRefresh){

                $.getJSON('./reckoningOrdersJson', function(orders, status) {

                    var observableOrders = self.getObservableOrders(orders);

                    reservedOrders=observableOrders;
                    needRefresh=false;

                    self.orders(observableOrders);

                    setTimeout(function() {
                        swiper.update();
                    }, 100);

                })

            }else if (reservedOrders != null) {

                newKeywords = '';

                self.sortOrders(reservedOrders);
                self.orders(reservedOrders);
                setTimeout(function() {
                    swiper.update();
                }, 100)
            }

        }

        function searchCurrentOrders(keywords) {


            var searchedOrders = reservedOrders.filter(function(order) {

                return order.client().indexOf(keywords) >= 0;
            });

            self.orders(searchedOrders);
            setTimeout(function() {
                swiper.update();
            }, 100)
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
                            setTimeout(function() {
                                swiper.update();
                            }, 100);

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