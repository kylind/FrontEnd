var ObjectID = require('mongodb').ObjectID;

var dateFormatting = {
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
};
var RATE = 0.9;


var util = {

    sumarizeOrder: function(order) {
        var buyPrice = 0,
            sellPrice = 0,
            profit = 0;

        var isBuyComplete = true;
        var isSellComplete = true;

        var rate = order.rate;

        order.items.forEach(function(item) {

            var itemBuy = parseFloat(item.buyPrice);
            var itemSell = parseFloat(item.sellPrice);
            var quantity = parseFloat(item.quantity);


            if (isNaN(itemBuy)) {

                isBuyComplete = false;

            } else {

                buyPrice += itemBuy * quantity;

            }

            if (isNaN(itemSell)) {

                isSellComplete = false;

            } else {
                var itemTotalSellPrice = itemSell < 2 ? (itemBuy * itemSell) * quantity : itemSell * quantity;

                if (isNaN(itemTotalSellPrice)) {
                    isSellComplete = false;
                } else {
                    sellPrice += itemTotalSellPrice;

                }

            }

            if (isNaN(itemBuy) || isNaN(itemSell) || isNaN(quantity)) {

                item.profit = '?'

            } else {

                var itemProfit = itemSell < 2 ? ((itemBuy * itemSell - itemBuy * rate) * quantity) : ((itemSell - itemBuy * rate) * quantity);

                item.profit = itemProfit.toFixed(1);

                profit += itemProfit;

            }

        });


        order.buyPrice = buyPrice == 0 ? null : buyPrice;



        order.sellPrice = sellPrice == 0 ? null : sellPrice;



        order.profit = (profit == 0) ? null : profit;

        order.isComplete = isSellComplete && isBuyComplete;

    },
    processOrder: function(order,rate) {


        if (!Array.isArray(order.items) || order.items.length == 0) {

            if (typeof order.items == 'object') {

                order.items = Object.keys(order.items).map(function(key) {
                    return order.items[key]
                });

            } else {
                order.items = [];
            }

        }

        order.items = order.items.filter(function(item) {
            return item.name == '' ? false : true;
        })

        order.items.forEach(function(item) {
            item.quantity = +item.quantity;
            item.isDone = item.isDone == 'true' ? true : false;
            item.buyPrice = item.buyPrice ? +item.buyPrice : null;
            item.sellPrice = item.sellPrice ? +item.sellPrice : null;
            item.tag = item.tag ? item.tag : '';
            delete item.profit;
            delete item.isChanged;
            delete item.isDoubtBuyPrice;
            delete item.isDoubtSellPrice;
            delete item.isLiveSearch;
        });


        delete order.displayDate;
        delete order.total;
        delete order.orderStatus;
        delete order.orderPackingStatus;
        delete order.orderReadyStatus;
        delete order.isChanged;
        delete order.__ko_mapping__;
        delete order.isLiveSearch;


        let name = order.client.trim().replace(/[\?\uff1f]$/, '?'); ///[\uff00|\uff1f]/g

        name = name.replace(/[\-\uff0d]/g, '-');

        order.client = name;


        if (ObjectID.isValid(order._id)) {

            console.log('valid id:' + order._id);

            order._id = new ObjectID(order._id);

            order.createDate = new Date(order.createDate);
            order.rate = +order.rate;


        } else {

            console.log('no valid id:' + order._id);
            delete order._id

            order.createDate = new Date();
            order.rate = rate;
        }

        util.sumarizeOrder(order);

        return order;
    },

    processProduct: function(product) {

        delete product.displayDate;
        delete product.isChanged;
        delete product.__ko_mapping__;
        if (ObjectID.isValid(product._id)) {

            console.log('valid id:' + product._id);

            product._id = new ObjectID(product._id);

            product.modifedDate = new Date(product.modifedDate);


        } else {

            console.log('no valid id:' + product._id);
            delete product._id

            product.modifiedDate = new Date();
        }
    }

}

exports.util = util;
