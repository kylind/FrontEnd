util = {

    sumarizeOrder: function(order) {
        var buyPrice = 0,
            sellPrice = 0,
            profit = NaN;

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

                item.profit = itemSell < 2 ? ((itemBuy * itemSell - itemBuy * rate) * quantity).toFixed(1) : ((itemSell - itemBuy * rate) * quantity).toFixed(1);

            }

        });

        if (buyPrice==0) {

            order.buyPrice = '?';


        } else {
            order.buyPrice = isBuyComplete ? buyPrice.toFixed(1) : (buyPrice.toFixed(1) + '?');
        }

        if (sellPrice==0) {

            order.sellPrice = '?';

        } else {
            order.sellPrice = isSellComplete ? sellPrice.toFixed(1) : (sellPrice.toFixed(1) + '?');
        }

        if (buyPrice==0 || sellPrice==0) {
            order.profit = '?'

        } else {
            order.profit = (sellPrice - buyPrice * rate).toFixed(1);

        }

    }


}

exports.util = util;
