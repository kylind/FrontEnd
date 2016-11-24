"use strict";define(["jquery","knockout","knockout.mapping"],function(e,t,s){t.mapping=s;var r=function(e){var s=this;s.name=t.observable(e&&e.name?e.name:""),s.quantity=t.observable(e&&e.quantity?e.quantity:"1"),s.buyPrice=t.observable(e&&!isNaN(e.buyPrice)?e.buyPrice:""),s.sellPrice=t.observable(e&&!isNaN(e.sellPrice)?e.sellPrice:""),s.profit=e&&e.profit?e.profit:"",s.note=e&&e.note?e.note:"",s.isDone=!(!e||!e.isDone)&&e.isDone,s.historicTrades=t.observableArray([]),s.isHistoricTradesOpen=!1,s.isChanged=!1,s.name.subscribe(function(e){s.isChanged=!0}),s.quantity.subscribe(function(e){s.isChanged=!0}),s.buyPrice.subscribe(function(e){s.isChanged=!0}),s.sellPrice.subscribe(function(e){s.isChanged=!0})},i=function(s,i){var n=this;n._id=t.observable(s?s._id:""),n.client=t.observable(s?s.client:""),n.postage=t.observable(s&&s.postage?s.postage:0);var a=[];if(s&&e.isArray(s.items)&&s.items.length>0)s.items.forEach(function(e){a.push(new r(e))});else for(var o=0;o<3;o++)a.push(new r);n.isChanged=!1,n.items=t.observableArray(a),n.items.subscribe(function(e){n.isChanged=!0}),n.client.subscribe(function(e){n.isChanged=!0}),n.postage.subscribe(function(e){n.isChanged=!0}),n.createDate=t.observable(s?s.createDate:""),n.displayDate=t.observable(s?s.displayDate:""),n.rate=s?s.rate:"",n.buyPrice=t.observable(s&&s.buyPrice?s.buyPrice:""),n.sellPrice=t.observable(s&&s.sellPrice?s.sellPrice:""),n.profit=t.observable(s&&s.profit?s.profit:""),n.isComplete=t.observable(!(!s||!s.isComplete)&&s.isComplete),n.formatPrice=function(e){if(!e)return"?";var t=e();return t?(+t).toFixed(1):"?"},n.total=t.pureComputed(function(){var e=parseFloat(this.sellPrice()),t=parseFloat(this.postage());return isNaN(e)||isNaN(t)?"?":(e+t).toFixed(1)},n);n.status=t.observable(s?s.status:"1RECEIVED"),n.packingStatus=s?s.packingStatus:"1ISREADY",n.orderStatus=t.pureComputed(function(){return"3DONE"==n.status()?"font-green":"2SENT"==n.status()?"font-yellow":void 0}),n.getHistoricTrades=function(s,r,n){var a=t.mapping.toJS(s),o=e(n.target).closest(".item").find(".historicbox");if(s.isHistoricTradesOpen)o.slideUp("fast",function(){s.isHistoricTradesOpen=!1,i.update()});else{var u=arguments[4];if(""==a.name)return;arguments[3](),e.getJSON("./historictrades",{itemName:a.name},function(e,t){"success"==t?s.historicTrades(e):s.historicTrades([]),o.slideDown("fast",function(){s.isHistoricTradesOpen=!0,u(),i.update()})})}},n.hasHistoricTrades=function(e){return e.historicTrades().length>0},n.addItem=function(){n.items.unshift(new r),i.update()},n.removeItem=function(e){n.items.remove(e),i.update()},n.addAddress=function(e){n.addresses.unshift({_id:"",client:n.client(),recipient:"",address:"",phone:""}),i.update()},n.getAddresses=function(t){arguments[3]();var s=arguments[4],r=t.client();""!=r&&e.getJSON("./addressesByClient",{client:r},function(e,r){"success"==r?t.addresses(e):t.addresses([]),i.update(),s()})};var u=[];n.removeAddress=function(e){""!=e._id&&u.push(e._id),n.addresses.remove(e),i.update()},n.submitAddresses=function(s){arguments[3]();var r=arguments[4],n=t.mapping.toJS(s.addresses);return e.post("./addresses",{client:s.client,addresses:n},function(e,t){s.addresses(e),i.update(),r()},"json"),!1},n.markDone=function(){arguments[3]();var t=arguments[4],s=arguments[1],r=n._id(),a=n.status(),o="1RECEIVED";"1RECEIVED"==a?o="2SENT":"2SENT"==a&&(o="3DONE"),e.ajax("./orderStatus/"+r,{success:function(e,r){n.status(o),"3DONE"==o||"3DONE"==a&&s.addExistingOrder(n),t(),i.update()},data:{status:o},dataType:"json",type:"PUT"})},n.submitOrder=function(s){arguments[3]();var r=(arguments[4],e.parseJSON(t.toJSON(s)));return e.post("./order",r,function(e,r){e.items.forEach(function(e){e.historicTrades=[]}),console.log("get post result"),t.mapping.fromJS(e,{},s)},"json"),!1}},n=function(s,n){function a(e){var t=s.filter(function(t){return t.client().indexOf(e)>=0});u.orders(t),setTimeout(function(){n.update()},100)}function o(t){l=t;var s=setTimeout(function(){for(var t=1;t<d.length;t++)clearTimeout(d[t]);d=[],""!=l&&e.ajax("./ordersByName",{data:{client:l},type:"GET",success:function(e,t){u.orders(u.getObservableOrders(e)),setTimeout(function(){n.update()},100)},dataType:"json"}),console.log("i am searching "+l)},1e3);d.push(s)}var u=this;u.getObservableOrders=function(e){var t=[];return e.forEach(function(e){t.push(new i(e,n))}),t};var c=u.getObservableOrders(s);u.orders=t.observableArray(c),u.toggleClientView=function(t,s,r){e(r.target).toggleClass("icon-eyeslash");var i=e(".orders--reckoning");e(r.target).hasClass("icon-eyeslash")?i.addClass("isClientView"):i.removeClass("isClientView")},u.submitOrders=function(){arguments[3]();var s=arguments[4],i=u.orders(),n=e.parseJSON(t.toJSON(i));if(Array.isArray(n)&&n.length>0){var a=[],o=n.filter(function(e,t){var s=!1;if(e.isChanged)s=!0;else for(var r=0;r<e.items.length;r++)if(e.items[r].isChanged){s=!0;break}return s&&a.push(t),s});o.length>0?e.post("/orders",{orders:o},function(n,o){n.forEach(function(s,n){var o=a[n];e.isArray(s.items)&&0==s.items.length&&(s.items=[{},{},{}]),s.items.forEach(function(e){e.historicTrades=[]}),t.mapping.fromJS(s,{items:{create:function(e){return new r(e.data)}}},i[o]),i[o].isChanged=!1}),s()},"json"):s()}return!1},u.addOrder=function(){var t=new i(null,n);u.orders.unshift(t),n.update(),e(window).scrollTop(0)},u.addExistingOrder=function(e){if(null!=s){var t=s.find(function(t){return t._id==e._id});t||s.unshift(e)}},u.removeDoneOrder=function(e){var t=e._id();if(null!=s){var r=s.filter(function(e){return e._id()!=t});s=r}u.orders.remove(e)},u.removeOrder=function(t){arguments[3]();var s=arguments[4],r=t._id();return u.orders.remove(t),""==r?(s(),void n.update()):(e.ajax("./order/"+r,{success:function(e,t){s()},dataType:"json",type:"DELETE"}),void n.update())};var s=null;u.searchOrders=function(t,r){null==s&&(s=u.orders());var i=e(r.target).val(),c=/(\s*)([\u4E00-\u9FA5\uF900-\uFA2D\w]+[\u4E00-\u9FA5\uF900-\uFA2D\w ]*)/,d=i.match(c);null!=d?""==d[1]?a(d[2]):o(d[2]):null!=s&&(l="",u.orders(s),setTimeout(function(){n.update()},100))};var d=[],l=""};return n});
//# sourceMappingURL=reckoning-orders.js.map