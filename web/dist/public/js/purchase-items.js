'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

define(['jquery', 'knockout', 'knockout.mapping'], function ($, ko, mapping) {

    ko.mapping = mapping;
    var Item = function Item(item) {
        var self = this;
        self._id = ko.observable(item ? item._id : '');
        self.quantity = ko.observable(item ? item.quantity : '');
        self.purchaseDetail = ko.observableArray(item ? item.purchaseDetail : []);

        self.subItems = ko.observableArray([]);

        self.hasItemDetail = function (subItem) {

            return self.subItems().length > 0 ? true : false;
        };

        self.displaySubItems = ko.computed(function () {

            return self.subItems().length > 0;
        });

        self.markDone = function () {};

        self.markItemStatus = function () {

            var purchaseDetail = self.purchaseDetail();

            var isDone = 0,
                notDone = 0;

            purchaseDetail.forEach(function (item) {
                if (item.isDone) {
                    isDone = item.quantity;
                } else {
                    notDone = item.quantity;
                }
            });

            if (notDone == self.quantity()) {
                return '';
            } else if (notDone == 0) {
                return 'font-green';
            } else {
                return "font-yellow";
            }
        };

        self.markSubItemStatus = function (item) {

            if (item.isDone) {
                return 'font-red';
            } else {
                return "";
            }
        };

        self.isSubItemsOpen = false;
    };

    var MarkedItem = function MarkedItem(item) {

        var self = this;
        self.name = item ? item.name : '';
        self.note = item ? item.note : '';
        self.quantity = item ? item.quantity : '';
    };

    var ItemsModel = function ItemsModel(items, markedItems, swiper) {

        function init(items, markedItems) {
            var observableItems = [];

            if (Array.isArray(items) && items.length > 0) {
                items.forEach(function (item) {

                    observableItems.push(new Item(item));
                });
            }

            var observableMarkedItems = [];

            if (Array.isArray(markedItems) && markedItems.length > 0) {
                markedItems.forEach(function (item) {

                    observableMarkedItems.push(new MarkedItem(item));
                });
            }

            return [observableItems, observableMarkedItems];
        }

        var items = init(items, markedItems);
        var observableItems = items[0];
        var observableMarkedItems = items[1];

        var self = this;

        self.itemview = ko.observable('name');

        self.items = ko.observableArray(observableItems);
        self.markedItems = ko.observableArray(observableMarkedItems);

        self.setItems = function (items, markedItems) {
            var _init = init(items, markedItems),
                _init2 = _slicedToArray(_init, 2),
                items = _init2[0],
                markedItems = _init2[1];

            self.items(items);
            self.markedItems(markedItems);
        };

        self.getSubName = function (item) {

            return 'item' + item.isDone;
        };

        self.getSubItems = function (item, parent, event) {

            var itemData = ko.mapping.toJS(item);

            if (!item.isSubItemsOpen) {
                arguments[3]();
                var succeed = arguments[4];
                $.getJSON('/subitems', { itemName: itemData._id }, function (res, status) {

                    if (status == 'success') {
                        item.subItems(res);
                    } else {
                        item.subItems([]);
                    }

                    $(event.target).parents('.orderitem-cnt').next().slideDown('fast', function () {
                        item.isSubItemsOpen = true;
                        swiper.update();
                        succeed();
                    });
                });
            } else {

                $(event.target).parents('.orderitem-cnt').next().slideUp('fast', function () {
                    item.isSubItemsOpen = false;
                    swiper.update();
                });
            }
        };

        self.markDone = function (item) {
            arguments[3]();
            var succeed = arguments[4];

            var itemData = ko.mapping.toJS(item);

            var isPurchased = true;

            itemData.purchaseDetail.forEach(function (item) {

                if (!item.isDone) {
                    isPurchased = false;
                }
            });

            $.post('/item', {
                itemName: itemData._id,
                isDone: !isPurchased
            }, function (res, status) {

                item.purchaseDetail(res.purchaseDetail);
                succeed();
            }, 'json');
        };
    };

    return ItemsModel;
});
//# sourceMappingURL=purchase-items.js.map
