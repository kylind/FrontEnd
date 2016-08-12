define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;
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

    }
    return IncomeListModel;
})
