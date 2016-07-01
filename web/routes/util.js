


util = {

sumarizeOrder: function(order){
    var buyPrice=0, sellPrice=0, profit=0;

    var isBuyComplete = true;
    var isSellComplete = true;

    var rate = order.rate;

    order.items.forEach(function(item){

        var itemBuy = parseFloat(item.buyPrice);
        var itemSell = parseFloat(item.sellPrice);

        if(isNaN(itemBuy)|| isNaN(itemSell)){

            if(isNaN(itemBuy)) isBuyComplete=false;
            if(isNaN(itemSell)) isSellComplete=false;

            item.profit = '?'

        }else{


            item.profit= itemSell<2 ? (itemBuy * itemSell - itemBuy* rate).toFixed(2) : (itemSell - itemBuy * rate).toFixed(2);

            buyPrice += itemBuy;
            sellPrice += itemSell <2 ? (itemBuy * itemSell) : itemSell

        }

    });

    order.buyPrice = isBuyComplete?  buyPrice : (buyPrice + '?');;
    order.sellPrice = isSellComplete?  sellPrice : (sellPrice + '?');

    order.profit= (sellPrice - buyPrice*rate).toFixed(2);

}


}

exports.util = util;


