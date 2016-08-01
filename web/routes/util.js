


util = {

sumarizeOrder: function(order){
    var buyPrice=0, sellPrice=0, profit=0;

    var isBuyComplete = true;
    var isSellComplete = true;

    var rate = order.rate;

    order.items.forEach(function(item){

        var itemBuy = parseFloat(item.buyPrice);
        var itemSell = parseFloat(item.sellPrice);
        var quantity = parseFloat(item.quantity);

        if(isNaN(itemBuy)|| isNaN(itemSell)|| isNaN(quantity)){

            if(isNaN(itemBuy)) isBuyComplete=false;
            if(isNaN(itemSell)) isSellComplete=false;

            item.profit = '?'

        }else{


            item.profit= itemSell<2 ? ((itemBuy * itemSell - itemBuy* rate)*quantity).toFixed(1) : ((itemSell - itemBuy * rate)*quantity).toFixed(1);

            buyPrice += itemBuy * quantity;
            sellPrice += itemSell <2 ? (itemBuy * itemSell) * quantity : itemSell * quantity

        }

    });

    order.buyPrice = isBuyComplete?  buyPrice.toFixed(1) : (buyPrice.toFixed(1) + '?');;
    order.sellPrice = isSellComplete?  sellPrice.toFixed(1) : (sellPrice.toFixed(1) + '?');

    order.profit= (sellPrice - buyPrice*rate).toFixed(1);

}


}

exports.util = util;


