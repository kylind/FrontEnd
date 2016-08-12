util = {

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

                item.profit=itemProfit.toFixed(1);

                profit+=itemProfit;

            }

        });

        /*        if (buyPrice==0) {

                    order.buyPrice = '?';

                } else {
                     order.buyPrice = isBuyComplete ? buyPrice.toFixed(1) : (buyPrice.toFixed(1) + '?');

                }*/

        order.buyPrice = buyPrice == 0 ? null : buyPrice;

        /*        if (sellPrice==0) {

                    order.sellPrice = '?';

                } else {
                    order.sellPrice = isSellComplete ? sellPrice.toFixed(1) : (sellPrice.toFixed(1) + '?');
                }*/

        order.sellPrice = sellPrice == 0 ? null : sellPrice;

        // if (buyPrice==0 || sellPrice==0) {
        //     order.profit = '?'

        // } else {
        //     order.profit = (sellPrice - buyPrice * rate).toFixed(1);

        // }

        order.profit = (profit == 0) ? null : profit;

        order.isComplete= isSellComplete && isBuyComplete;


    }


}

exports.util = util;
