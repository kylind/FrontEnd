define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;
    var Item = function(item) {
        var self = this;
        self._id = ko.observable(item ? item._id : '');
        self.quantity = ko.observable(item ? item.quantity : '');
        self.purchaseDetail = ko.observableArray(item ? item.purchaseDetail : []);

        self.subItems = ko.observableArray([]);

        self.hasItemDetail = function(subItem) {

            return self.subItems().length > 0 ? true : false;

        };

        self.displaySubItems = ko.computed(function() {

            return self.subItems().length > 0;

        });

        self.markDone = function() {

        }

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

            if (notDone == self.quantity()) {
                return '';
            } else if (notDone == 0) {
                return 'font-green';
            } else {
                return "font-yellow";
            }



        }

        self.markSubItemStatus = function(item) {

            if (item.isDone) {
                return 'font-red';

            } else {
                return "";
            }


        }

        self.isSubItemsOpen = false;

    };

    var ItemsModel = function(items, swiper) {

        function init(items) {
            var observableItems = [];

            if (Array.isArray(items) && items.length > 0) {
                items.forEach(function(item) {

                    observableItems.push(new Item(item));

                })
            }

            return observableItems;
        }

        var observableItems = init(items);



        var self = this;

        self.items = ko.observableArray(observableItems);

        self.setItems = function(items) {

            self.items(init(items));

        }

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
                        item.subItems(res);

                    } else {
                        item.subItems([]);
                    }

                    $(event.target).parents('.orderitem-cnt').next().slideDown('fast', function() {
                        item.isSubItemsOpen = true;
                        swiper.update();
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

        self.markDone = function(item) {
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
                    succeed();
                },
                'json'
            );

        };

    }



    return ItemsModel;

})
