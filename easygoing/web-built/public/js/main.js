define('ReceivedOrders',['common'], function(util) {

    var $ = util.$;

    var ko = util.ko;
    ko.mapping = util.mapping;

    var Item = function(item) {
        var self = this;

        self.name = ko.observable(item && item.name ? item.name : '');
        self.quantity = ko.observable(item && item.quantity ? item.quantity : '1');
        self.note = ko.observable(item && item.note ? item.note : '');



        self.buyPrice = item && !isNaN(item.buyPrice) ? item.buyPrice : '';
        self.sellPrice = item && !isNaN(item.sellPrice) ? item.sellPrice : '';

        self.profit = item && item.profit ? item.profit : '';
        self.isDone = (item && typeof item.isDone != 'undefined') ? item.isDone : false;
        self.tag = item && item.tag ? item.tag : '';




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
        self.packingStatus = ko.observable(order && order.packingStatus ? order.packingStatus : '1ISREADY');

        self.rate = order && order.rate ? order.rate : null;
        self.postage = order && order.postage ? order.postage : 0;
        self.buyPrice = order && order.buyPrice ? order.buyPrice : '';
        self.sellPrice = order && order.sellPrice ? order.sellPrice : '';
        self.profit = order && order.profit ? order.profit : '';
        self.status = order && order.status ? order.status : '1RECEIVED';
        self.createDate = order && order.createDate ? order.createDate : '';



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

        function sortOrders(orders) {

            orders.sort(function(orderA, orderB) {

                var aStatus = orderA.packingStatus();
                var bStatus = orderB.packingStatus()

                if (aStatus == bStatus) {

                    return orderA.createDate <= orderB.createDate ? 1 : -1;

                } else {
                    return aStatus < bStatus ? -1 : 1;
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


        self.setOrders = function(orders, isInitial) {

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

            $.post('./order', orderData, function(data, status) {

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

                    $.post('./orders', { orders: changedOrders }, function(rs, status) {


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

                    if ($('#search-receivedOrders').val() == '') {

                        var orders = self.orders();

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


            if (keywords == '') {

                sortOrders(orders);

                var searchedOrders = orders;

            } else {
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

});

define('ItemsModel',['common'], function(util) {

    var $ = util.$;
    var ko = util.ko;
    ko.mapping = util.mapping;


    var SubItem = function(subItem) {
        var self = this;
        self._id = subItem._id;
        self.client = subItem.client;
        self.name = subItem.name;
        self.note = subItem.note;
        self.quantity = subItem.quantity;
        self.isDone = ko.observable(subItem.isDone);

    }
    var Item = function(item, swiper) {
        var self = this;
        self._id = item ? item._id : '';
        self.quantity = item ? item.quantity : '';
        self.tag = ko.observable((item && item.tag) ? item.tag : '');
        self.purchaseDetail = ko.observableArray(item ? item.purchaseDetail : []);



        self.subItems = ko.observableArray([]);


        self.updateSubItems = function(subItems) {

            var newSubItems = [];

            if (Array.isArray(subItems) && subItems.length > 0) {
                subItems.forEach(function(_item) {
                    newSubItems.push(new SubItem(_item));
                })

            }

            self.subItems(newSubItems);

        }

        self.hasItemDetail = function(subItem) {

            return self.subItems().length > 0 ? true : false;

        };

        self.restCount = ko.pureComputed(function() {

            var purchaseDetail = self.purchaseDetail();

            var isDone = 0,
                notDone = 0;

            purchaseDetail.forEach(function(item) {
                if (item.isDone) {
                    isDone = item.quantity;

                } else {
                    notDone = item.quantity;

                }

            })
            if (isDone < self.quantity && isDone != 0) {

                return self.quantity - isDone;

            } else {

                return '';
            }

        });

        self.displaySubItems = ko.pureComputed(function() {

            return self.subItems().length > 0;

        });

        function synchronizePurchaseDetail(allItems) {
            var index = allItems.findIndex(function(_item) {
                return _item._id == self._id && _item.tag == self.tag();

            })

            if (index > -1) {
                allItems[index] = ko.mapping.toJS(self);
            }



        }

        self.markDone = function(item, parent, event) {

            arguments[3]();
            var succeed = arguments[4];

            var itemData = ko.mapping.toJS(item);

            var isPurchased = true;


            itemData.purchaseDetail.forEach(function(item) {

                if (!item.isDone) {
                    isPurchased = false;
                }

            });

            $.post('./item', {
                    itemTag: itemData.tag,
                    itemName: itemData._id,
                    isDone: !isPurchased
                }, function(res, status) {

                    item.purchaseDetail(res.purchaseDetail);
                    synchronizePurchaseDetail(parent.allItems);

                    var flagColor = (!isPurchased) ? "font-green" : "";

                    if (self.displaySubItems) {

                        self.subItems().forEach(function(_item) {
                            _item.isDone(!isPurchased);
                        })
                    }
                    succeed();
                },
                'json'
            );

        };

        self.markItemStatus = function() {

            var purchaseDetail = self.purchaseDetail();

            var isDone = 0,
                notDone = 0;

            purchaseDetail.forEach(function(item) {
                if (item.isDone) {
                    isDone = item.quantity;

                } else {
                    notDone = item.quantity;

                }

            })

            if (notDone == self.quantity) {
                return '';
            } else if (isDone == self.quantity) {
                return 'font-green';
            } else {
                return 'font-yellow';
            }

        }

        self.markSubItemDone = function(subItem, parent, event) {

            arguments[3]();
            var succeed = arguments[4];
            var root = arguments[5];

            var subItemData = ko.mapping.toJS(subItem);
            subItemData.isDone = !subItemData.isDone;
            subItemData.tag = parent.tag();



            $.post('./subitem', subItemData, function(res, status) {

                    subItem.isDone(!subItem.isDone());

                    //$(event.target).toggleClass('font-green');

                    self.purchaseDetail(res.purchaseDetail);
                    synchronizePurchaseDetail(root.allItems);

                    self.subItems().forEach(function(_item) {
                        if (_item.client == subItem.client) {
                            _item.isDone(subItem.isDone());
                        }
                    });
                    succeed();

                },
                'json'
            );

        }


        self.getSubName = function(item) {

            return 'item' + item.isDone;

        };

        self.getSubItems = function(item, parent, event) {


            var itemData = ko.mapping.toJS(item);

            if (!item.isSubItemsOpen) {
                arguments[3]();
                var succeed = arguments[4]
                $.getJSON('./subitems', { itemName: itemData._id, itemTag: itemData.tag }, function(res, status) {

                    if (status == 'success') {

                        //item.subItems(res);

                        self.updateSubItems(res);

                    } else {
                        item.subItems([]);
                    }

                    $(event.target).parents('.orderitem-cnt').next().slideDown('fast', function() {
                        item.isSubItemsOpen = true;
                        succeed();
                    });

                });

            } else {

                $(event.target).parents('.orderitem-cnt').next().slideUp('fast', function() {
                    item.isSubItemsOpen = false;
                    swiper.update();
                });


            }



        };

        self.isSubItemsOpen = false;

    };


    var MarkedItem = function(item) {

        var self = this;
        self.name = item ? item.name : '';
        self.note = item ? item.note : '';
        self.quantity = item ? item.quantity : '';

    };

    var ItemsModel = function(items, swiper) {

        function convertPurchaseStatus(item) {

            var detail = typeof item.purchaseDetail == 'function' ? item.purchaseDetail() : item.purchaseDetail;

            var isDone = 0,
                notDone = 0;

            detail.forEach(function(_item) {
                if (_item.isDone) {
                    isDone = _item.quantity;

                } else {
                    notDone = _item.quantity;

                }

            })

            if (notDone == item.quantity) {
                return -1;
            } else if (isDone == item.quantity) {
                return 1;
            } else {
                return 0
            }
        }

        function compareTag(itemA, itemB) {


            if (itemA.tag < itemB.tag) {
                return -1;
            } else if (itemA.tag > itemB.tag) {
                return 1;
            } else {
                var statusNumberA = convertPurchaseStatus(itemA);
                var statusNumberB = convertPurchaseStatus(itemB);

                if (statusNumberA < statusNumberB) {
                    return -1;
                } else if (statusNumberA > statusNumberB) {
                    return 1;
                } else {
                    var aFirstLetter = itemA._id.substr(0, 1);
                    var bFirstLetter = itemB._id.substr(0, 1);
                    if (aFirstLetter < bFirstLetter) {
                        return -1;
                    } else if (aFirstLetter > bFirstLetter) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }

        }

        function compareStatus(itemA, itemB) {

            var statusNumberA = convertPurchaseStatus(itemA);
            var statusNumberB = convertPurchaseStatus(itemB);

            if (statusNumberA < statusNumberB) {
                return -1;
            } else if (statusNumberA > statusNumberB) {
                return 1;
            } else {

                if (itemA.tag < itemB.tag) {
                    return -1;
                } else if (itemA.tag > itemB.tag) {
                    return 1;
                } else {
                    var aFirstLetter = itemA._id.substr(0, 1);
                    var bFirstLetter = itemB._id.substr(0, 1);
                    if (aFirstLetter < bFirstLetter) {
                        return -1;
                    } else if (aFirstLetter > bFirstLetter) {
                        return 1;
                    } else {
                        return 0;
                    }
                }


            }
        }

        function init(items, needRefreshTag, orderBy) {
            var observableItems = [];
            var tags = [];

            if (Array.isArray(items) && items.length > 0) {

                if (orderBy == 'status') {
                    items.sort(compareStatus)
                } else {
                    items.sort(compareTag)
                }

                items.forEach(function(item) {

                    observableItems.push(new Item(item, swiper));

                    if (needRefreshTag) {
                        if (tags.indexOf(item.tag) < 0 && item.tag) {
                            tags.push(item.tag);
                        }
                    }

                })

            }


            return [observableItems, tags];
        }

        var self = this;

        self.allItems = [];

        self.tags = ko.observableArray();

        self.items = ko.observableArray();


        self.setItems = function(items, isAll, needBinding) {

            var needRefreshTag = false;

            if (isAll) {
                $('.link-tag.all').addClass('isActive');
                needRefreshTag = true;
            }


            var [items, tags] = init(items, needRefreshTag);

            self.items(items);

            if (isAll) {
                self.tags(tags);
                self.allItems = self.items().map(function(item) {
                    return ko.mapping.toJS(item);
                });
            }

            if (needBinding) {
                setTimeout(function() {
                    $('.hidden-tag').tag();

                }, 10);
            }

            setTimeout(function() {
                swiper.update();
            }, 100);

        }

        self.setItems(items, true, false);



        self.refreshItems = function(sortfield) {

            var currentItems = self.items().map(function(item) {
                return ko.mapping.toJS(item);

            })
            var $currentTab = $('.link-tag.isActive')

            if (!$currentTab.hasClass('all')) {
                currentItems = currentItems.filter(function(item) {
                    return item.tag == $currentTab.text();

                })

            }

            var [items, tags] = init(currentItems, false, sortfield);

            self.items(items);

            setTimeout(function() {
                $('.hidden-tag').tag();

            }, 10);

        }

        self.filterItems = function(tag, parent, event) {

            var $currentTag = $(event.target);

            var $previousTag = $('.link-tag.isActive');



            $previousTag.removeClass('isActive');
            $currentTag.addClass('isActive');

            if ($currentTag.hasClass('all')) {

                self.setItems(self.allItems, true, true);

            } else {

                var specificItems = self.allItems.filter(function(item) {
                    return item.tag == tag;
                });

                self.setItems(specificItems, false, true);

            }

            swiper.update();

            $(document).click();

        }

    }

    return ItemsModel;

})
;
define('ReckoningOrders',['common'], function(util) {

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


});
define('IncomeList',['common'], function(util) {

    var $ = util.$;
    var ko = util.ko;
    ko.mapping = util.mapping;

    var IncomeListModel = function(incomeList) {

        var self = this;

        self.incomeList = ko.observableArray(incomeList);

        self.setIncomeList = function(incomeList) {
            self.incomeList(incomeList)
        }

        self.formatPrice = function(price) {

            if (price) {
                return (+price).toFixed(1);
            } else {
                return '?'
            }
        }

        self.toggleTotalView = function(data, parent, event) {

            $(event.target).toggleClass('icon-eyeopen');


            var $order = $(event.target).closest('.orderitem-cnt');

            if ($(event.target).hasClass('icon-eyeopen')) {
                $order.addClass("isShow");
            } else {
                $order.removeClass("isShow");
            }

        }

    }
    return IncomeListModel;
})
;
require(['common', 'ReceivedOrders','ItemsModel', 'ReckoningOrders', 'IncomeList'], function(util, OrdersModel) {
    var $ = util.$;
    var ko = util.ko;
    var mapping = util.mapping;
    var Swiper = util.Swiper;

    var viewModelStatus = [false, false, false, false];

    function setViewModelStatus(activeIndex) {

        switch (activeIndex) {
            case 0:
                viewModelStatus[1] = true;
                viewModelStatus[2] = true;
                break;
            case 1:
                viewModelStatus[0] = true;
                viewModelStatus[2] = true;
                break;
            case 2:
                viewModelStatus[0] = true;
                viewModelStatus[1] = true;
                viewModelStatus[3] = true;
                break;
        }
    }

    function updateCurrentData() {

        if (swiper.activeIndex == 0) {

            $.getJSON('./receivedOrdersJson', function(orders, status) {
                ordersModel.setOrders(orders, true);
                setTimeout(function() {
                    swiper.update();
                }, 100);
            });

        }

        if (swiper.activeIndex == 2) {

            $.getJSON('./reckoningOrdersJson', function(orders, status) {

                var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                reckoningOrdersModel.orders(observableOrders);

                setTimeout(function() {
                    swiper.update();
                }, 100);

            })

        }

    }

    function updateAllData() {

        var activeIndex = swiper.activeIndex;


        if (activeIndex == 1 || activeIndex == 2) {
            $.getJSON('./receivedOrdersJson', function(orders, status) {
                ordersModel.setOrders(orders, true);
                setTimeout(function() {
                    swiper.update();
                }, 100);
            });

        }

        if (activeIndex == 0 || activeIndex == 2) {

            $.getJSON('./purchaseItemsJson', function(rs, status) {
                itemsModel.setItems(rs.items, true, true);
                setTimeout(function() {
                    swiper.update();
                }, 100);
            });

        }


        if (activeIndex == 0 || activeIndex == 1) {

            $.getJSON('./reckoningOrdersJson', function(orders, status) {

                var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                reckoningOrdersModel.orders(observableOrders);
                setTimeout(function() {
                    swiper.update();
                }, 100);

            })

        }

        if (activeIndex == 2) {

            $.getJSON('./incomeListJson', function(incomeList, status) {
                incomeListModel.setIncomeList(incomeList);
            })
            setTimeout(function() {
                swiper.update();
            }, 100);

        }
    }

    var swiper = new Swiper('.swiper-container', {
        autoHeight: true,
        spaceBetween: 30,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        simulateTouch: false,
        shortSwipes: false,
        longSwipes: false,
        paginationBulletRender: function(index, className) {
            var bulletName = '';
            switch (index) {
                case 0:

                    bulletName = '接单';
                    break;

                case 1:
                    bulletName = '采购';
                    break;

                case 2:
                    bulletName = '算账';
                    break;

                case 3:
                    bulletName = '收益';
                    break;
            }
            return '<span class="' + className + '">' + bulletName + '</span>';
        }

    });


    util.initTapEvent({
        updateAllData: updateAllData,
        updateCurrentData: updateCurrentData,
        setViewModelStatus: setViewModelStatus,
        swiper: swiper

    })

    var itemsModel, reckoningOrdersModel, incomeListModel, addressesModel;

    var ordersModel = new OrdersModel(orders);
    ordersModel.setSwiper(swiper);

    ko.applyBindings(ordersModel, $('#receivedOrders')[0]);

    require(['common', 'ItemsModel', 'ReckoningOrders', 'IncomeList'], function(util, ItemsModel, OrdersModel, IncomeListModel) {

        var $ = util.$;
        var ko = util.ko;

        var purchasePromise = new Promise(function(resolve, reject) {

            $.getJSON('./purchaseItemsJson', function(rs, status) {

                itemsModel = new ItemsModel(rs.items, swiper);


                resolve(itemsModel);


                ko.applyBindings(itemsModel, $('#purchaseItems')[0]);

                var promise = new Promise(function(resolve, reject) {
                    $.getJSON(`./user/${USER_ID}`, function(rs, status) {
                        resolve(rs);
                    });
                });

                promise.catch(function(reason) {

                })

                promise.then(function(rs) {

                    var tags = Array.isArray(rs.tags) ? rs.tags : [];

                    $('.hidden-tag').tag({
                        tags: tags,
                        updateTag: function(itemName, oldTag, newTag) {

                            if (oldTag == newTag) return;

                            if (Array.isArray(itemsModel.allItems) && itemsModel.allItems.length > 0) {
                                var item = itemsModel.allItems.find(function(item) {
                                    return item._id == itemName;

                                });

                                item.tag = newTag;

                                if (item) {

                                    var tags = [];


                                    itemsModel.allItems.forEach(function(item) {

                                        if (tags.indexOf(item.tag) < 0 && item.tag) {
                                            tags.push(item.tag);
                                        }

                                    })

                                    itemsModel.tags(tags);
                                }

                            }

                            $.post('./itemtag', {
                                    itemName: itemName,
                                    oldTag: oldTag,
                                    newTag: newTag

                                }, function(res, status) {

                                    //updateAllData();
                                    setViewModelStatus(swiper.activeIndex);


                                },
                                'json'
                            );

                        }

                    });

                });

            });

        });



        var reckoningPromise = new Promise(function(resolve, reject) {

            $.getJSON('./reckoningOrdersJson', function(orders, status) {
                reckoningOrdersModel = new OrdersModel(orders, swiper);
                resolve(reckoningOrdersModel);
                ko.applyBindings(reckoningOrdersModel, $('#reckoningOrders')[0]);


            });

        })

        Promise.all([purchasePromise, reckoningPromise]).then(function(rs) {

        })

        $.getJSON('./incomeListJson', function(incomeList, status) {
            incomeListModel = new IncomeListModel(incomeList, swiper);
            ko.applyBindings(incomeListModel, $('#incomeList')[0]);


        });

        $(document).on('keydown', function(event) {
            if (event.keyCode == 13 && (swiper.activeIndex == 0 || swiper.activeIndex == 2)) {
                //var $target = $(document.activeElement).closest('.enterArea').find('.action-enter');
                $(document.activeElement).blur();

                var targetPage = swiper.activeIndex == 0 ? 'receivedOrders' : 'reckoningOrders'

                var $target = $('#' + targetPage + ' .action-enter');
                setTimeout(function() {
                    $target.trigger('click')
                }, 100);
                return false;
            }

        });


        swiper.params.onSlideChangeStart = function(swiper) {

            var activeIndex = swiper.activeIndex;
            switch (swiper.activeIndex) {
                case 0:

                    if (viewModelStatus[activeIndex]) {

                        $.getJSON('./receivedOrdersJson', function(orders, status) {

                            ordersModel.setOrders(orders, true);
                            viewModelStatus[activeIndex] = false;

                        });
                    }

                    break;

                case 1:
                    if (viewModelStatus[activeIndex]) {
                        $.getJSON('./purchaseItemsJson', function(rs, status) {
                            itemsModel.setItems(rs.items, true, true);
                            viewModelStatus[activeIndex] = false;

                        });
                    }
                    break;

                case 2:
                    if (viewModelStatus[activeIndex]) {
                        $.getJSON('./reckoningOrdersJson', function(orders, status) {

                            var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                            reckoningOrdersModel.orders(observableOrders);
                            viewModelStatus[activeIndex] = false;

                        })
                    }

                    break;

                case 3:
                    if (viewModelStatus[activeIndex]) {
                        $.getJSON('./incomeListJson', function(incomeList, status) {
                            incomeListModel.setIncomeList(incomeList);
                            viewModelStatus[activeIndex] = false;

                        })
                    }
                    break;

            }

            setTimeout(function() {
                $(window).scrollTop(0);
            }, 100);

        }

    });

    require(['commonAngular', 'settings'], function(angular) {

        angular.bootstrap($('#settings')[0], ['settings']);

        $('.icon-cog').colorbox({
            inline: true,
            width: 335,
            height: 200,
            scrolling: false,
            close: '',
            top: 0,
            onComplete: function() {
                setInterval(function() {
                    $.colorbox.resize();
                }, 200)
            }
        });

        $(window).scroll(function() {
            var top = $(window).scrollTop();
            $(".cogbox").css("top", top + 10);
            $(".swiper-pagination").css('top', top);
            $(".searchbox").css("top", top);

        });

    })


});

define("../js/main", function(){});

