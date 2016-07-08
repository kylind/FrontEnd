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
                return 'font-red';
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

    var ItemsModel = function(items) {

        var observableItems = [];

        items.forEach(function(item) {

            observableItems.push(new Item(item));

        })



        var self = this;

        self.items = ko.observableArray(observableItems);

        self.getSubName = function(item) {

            return 'item' + item.isDone;

        };

        self.getSubItems = function(item, event) {

            var itemData = ko.mapping.toJS(item);

            if (!item.isSubItemsOpen) {
                $.getJSON('/subitems', { itemName: itemData._id }, function(res, status) {

                    if (status == 'success') {
                        item.subItems(res);

                    } else {
                        item.subItems([]);
                    }

                    $(event.target).parents('tr').next().show(function() {
                        item.isSubItemsOpen = true;
                    });

                });

            } else {

                $(event.target).parents('tr').next().hide(function() {
                    item.isSubItemsOpen = false;
                });


            }



        };

        self.markDone = function(item) {

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
                },
                'json'
            );

        };

    }



    return ItemsModel;

})
