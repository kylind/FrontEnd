define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;

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

            $.post('/item', {
                    itemName: itemData._id,
                    isDone: !isPurchased
                }, function(res, status) {

                    item.purchaseDetail(res.purchaseDetail);

                    var flagColor = (!isPurchased) ? "font-green" : "";

                    if (self.displaySubItems) {
                        // var $subItems = $(event.target).closest('.orderitem').find('.subItems-cnt .icon-flag');
                        // if (flagColor == "") {
                        //     $subItems.removeClass('font-green');
                        // } else {
                        //     $subItems.addClass('font-green');
                        // }

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

            var subItemData = ko.mapping.toJS(subItem);
            subItemData.isDone = !subItemData.isDone;



            $.post('/subitem', subItemData, function(res, status) {

                    subItem.isDone(!subItem.isDone());

                    //$(event.target).toggleClass('font-green');

                    self.purchaseDetail(res.purchaseDetail);

                    self.subItems().forEach(function(_item) {
                        if (_item.client == subItem.client) {
                            _item.isDone(subItem.isDone());
                        }
                    })
                    succeed();
                },
                'json'
            );

        }



        /*        self.markSubItemStatus = function(item) {

                    if (item.isDone) {
                        return 'font-green';

                    } else {
                        return "";
                    }

                    self.subItems().forEach(function(_item){
                        if(_item.name==item.nam){
                            _item.isDone
                        }
                    })


                }*/


        self.getSubName = function(item) {

            return 'item' + item.isDone;

        };

        self.getSubItems = function(item, parent, event) {


            var itemData = ko.mapping.toJS(item);

            if (!item.isSubItemsOpen) {
                arguments[3]();
                var succeed = arguments[4]
                $.getJSON('/subitems', { itemName: itemData._id }, function(res, status) {

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

            var detail = item.purchaseDetail;

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



        function init(items) {
            var observableItems = [];
            var tags = [];

            if (Array.isArray(items) && items.length > 0) {

                items.sort(function(itemA, itemB) {
                    if (!itemA.tag) {
                        return -1;
                    } else if (!itemB.tag) {
                        return 1;
                    } else {
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
                                return 0;
                            }
                        }
                    }

                })


                items.forEach(function(item) {

                    observableItems.push(new Item(item, swiper));
                    if (tags.indexOf(item.tag) < 0) {
                        tags.push(item.tag);
                    }


                })

            }


            return [observableItems, tags];
        }

        var items = init(items);
        observableItems = items[0];
        tags = items[1];


        var self = this;

        self.tags = ko.observableArray(tags);

        self.items = ko.observableArray(observableItems);


        self.setItems = function(items, tags) {
            var [items, markedItems] = init(items)

            self.items(items);
            if (tags) {
                self.tags(tags);
            }

        }


        self.allItems=[];
        self.filterItems = function(tag, parent, event) {

            var $currentTag = $(event.target);

            var $previousTag = $('.link-tag.isActive');

            if ($previousTag.hasClass('all')) {
                self.allItems = self.items();
            }

            $previousTag.removeClass('isActive');
            $currentTag.addClass('isActive');

            if ($currentTag.hasClass('all')) {

                self.setItems(self.allItems);
                self.allItems=[];

            } else {

                var specificItems = self.allItems.filter(function(item) {
                    return item.tag == tag;
                });

                self.setItems(specificItems);

            }



        }

    }

    return ItemsModel;

})
