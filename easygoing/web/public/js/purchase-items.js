define(['common'], function(util) {

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
        self._id = item && item._id ? item._id : '';
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

            if (!item.isSubItemsOpen()) {
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
                        item.isSubItemsOpen(true);
                        succeed();
                    });

                });

            } else {

                $(event.target).parents('.orderitem-cnt').next().slideUp('fast', function() {
                    item.isSubItemsOpen(false);
                    swiper.update();
                });


            }



        };

        self.getExpandCollapse = function() {
            if(self.isSubItemsOpen()){
                return 'icon-collapse';

            }else{
                return 'icon-expand';

            }

        }


        self.isSubItemsOpen = ko.observable(false);

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

        };

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

        };
        self.afterRender=function(){
            swiper.update();
        };

    }

    return ItemsModel;

})
