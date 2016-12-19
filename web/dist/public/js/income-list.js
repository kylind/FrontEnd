'use strict';

define(['jquery', 'knockout', 'knockout.mapping'], function ($, ko, mapping) {

    ko.mapping = mapping;
    var IncomeListModel = function IncomeListModel(incomeList) {

        var self = this;

        self.incomeList = ko.observableArray(incomeList);

        self.setIncomeList = function (incomeList) {
            self.incomeList(incomeList);
        };

        self.formatPrice = function (price) {

            if (price) {
                return (+price).toFixed(1);
            } else {
                return '?';
            }
        };

        self.toggleTotalView = function (data, parent, event) {

            $(event.target).toggleClass('icon-eyeopen');

            var $order = $(event.target).closest('.orderitem-cnt');

            if ($(event.target).hasClass('icon-eyeopen')) {
                $order.addClass("isShow");
            } else {
                $order.removeClass("isShow");
            }
        };
    };
    return IncomeListModel;
});
//# sourceMappingURL=income-list.js.map
