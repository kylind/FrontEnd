


util = {

sumarizeOrder: function(order){
    var buyPrice=0, sellPrice=0, profit=0;

    var isBuyComplete = true;
    var isSellComplete = true;

    var rate = order.rate;

    order.items.forEach(function(item){
        if(isNaN(item.buyPrice)|| isNaN(item.sellPrice)){
            if(isNaN(item.buyPrice)) isBuyComplete=false;
            if(isNaN(item.sellPrice)) isSellComplete=false;

            item.profit = '?'

        }else{



            item.profit= item.sellPrice<2 ? (item.buyPrice * item.sellPrice - item.buyPrice* rate) : (item.sellPrice - item.buyPrice * rate);


            buyPrice += item.buyPrice;
            sellPrice += item.sellPrice <2 ? (item.buyPrice * item.sellPrice) : item.sellPrice

        }

    });

    order.buyPrice = isBuyComplete?  buyPrice : (buyPrice + '?');;
    order.sellPrice = isSellComplete?  sellPrice : (sellPrice + '?');

    order.profit= sellPrice - buyPrice*rate;

}


}

exports.util = util;


