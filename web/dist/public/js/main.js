"use strict";requirejs.config({baseUrl:"./components",paths:{jquery:"jquery/dist/jquery.min",knockout:"knockout/dist/knockout","knockout.mapping":"/js/knockout.mapping.2.4.1.min",ReceivedOrders:"/js/received-orders",ReckoningOrders:"/js/reckoning-orders",IncomeList:"/js/income-list",Addresses:"/js/addresses",ItemsModel:"/js/purchase-items",swiper:"Swiper/dist/js/swiper.jquery.min"},shim:{swiper:["jquery"],"knockout.mapping":["knockout"]}}),require(["ReceivedOrders","knockout","jquery","swiper"],function(e,t,n,s){var r="ontouchstart"in document.documentElement?"touchstart":"click",a=n.fn.on;n.fn.on=function(){return arguments[0]="click"===arguments[0]?r:arguments[0],a.apply(this,arguments)},t.bindingHandlers.tap={init:function(e,t,s,r,a){var i=t();n(e).on("click",function(e){$target=n(e.target);var t=n(".prompt-submitting"),s=n(".prompt-succeed"),r=n(".confirm");if($target.hasClass("action-delete")&&$target.hasClass("action-submit")){var o=$target.offset();n(".confirm-submit").one("click",function(){r.fadeOut("slow"),i(a.$data,a.$parent,e,function(){t.children("span").text("Submitting...");var e=$target.offset();n(".prompt").css("top",e.top).show()},function(){t.addClass("disappeared"),s.removeClass("disappeared"),n(".prompt").delay(600).fadeOut("slow",function(){t.removeClass("disappeared"),s.addClass("disappeared")})})}),n(".confirm-cancel").one("click",function(){r.fadeOut("slow")}),n(".confirm").css("top",o.top).fadeIn("slow")}else $target.hasClass("action-submit")?setTimeout(function(){i(a.$data,a.$parent,e,function(){t.children("span").text("Submitting...");var e=$target.offset();n(".prompt").css("top",e.top).show()},function(){t.addClass("disappeared"),s.removeClass("disappeared"),n(".prompt").delay(1200).fadeOut("slow",function(){t.removeClass("disappeared"),s.addClass("disappeared")})})},100):$target.hasClass("action-load")?i(a.$data,a.$parent,e,function(){t.children("span").text("Loading...");var e=$target.offset();n(".prompt").css("top",e.top).show()},function(){n(".prompt").delay(600).fadeOut("slow")}):i(a.$data,a.$parent,e);return!1})},update:function(e,t,n,s,r){}};var i=new e(orders);t.applyBindings(i,n("#receivedOrders")[0]);var o=new s(".swiper-container",{autoHeight:!0,spaceBetween:30,pagination:".swiper-pagination",paginationClickable:!0,simulateTouch:!1,shortSwipes:!1,longSwipes:!1,paginationBulletRender:function(e,t){var n="";switch(e){case 0:n="Receiving";break;case 1:n="Purchase";break;case 2:n="Reckoning";break;case 3:n="Income"}return'<span class="'+t+'">'+n+"</span>"}});i.setSwiper(o),n(window).scroll(function(){var e=n(window).scrollTop();n(".searchbox").css("top",e)}),require(["ItemsModel","ReckoningOrders","IncomeList","Addresses","knockout","jquery"],function(e,t,n,s,r,a){var c,d,p,u;a.getJSON("./purchaseItemsJson",function(t,n){c=new e(t.items,t.markedItems,o),r.applyBindings(c,a("#purchaseItems")[0])}),a.getJSON("./reckoningOrdersJson",function(e,n){d=new t(e,o),r.applyBindings(d,a("#reckoningOrders")[0])}),a.getJSON("./incomeListJson",function(e,t){p=new n(e,o),r.applyBindings(p,a("#incomeList")[0])}),a(document).on("keydown",function(e){if(13==e.keyCode&&(0==o.activeIndex||2==o.activeIndex)){a(document.activeElement).blur();var t=0==o.activeIndex?"receivedOrders":"reckoningOrders",n=a("#"+t+" .action-enter");return setTimeout(function(){n.trigger("click")},100),!1}}),o.params.onSlideChangeStart=function(e){switch(e.activeIndex){case 0:a.getJSON("./receivedOrdersJson",function(t,n){i.setOrders(t),e.update()});break;case 1:a.getJSON("./purchaseItemsJson",function(t,n){c.setItems(t.items,t.markedItems),e.update()});break;case 2:a.getJSON("./reckoningOrdersJson",function(t,n){var s=d.getObservableOrders(t);d.orders(s),e.update()});break;case 3:a.getJSON("./incomeListJson",function(t,n){p.setIncomeList(t),e.update()});break;case 4:a.getJSON("./addressesJson",function(t,n){u.setAddresses(t),e.update()})}a(window).scrollTop(0)}})});
//# sourceMappingURL=main.js.map
