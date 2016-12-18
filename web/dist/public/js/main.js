"use strict";requirejs.config({baseUrl:"./components",paths:{jquery:"jquery/dist/jquery.min",knockout:"knockout/dist/knockout","knockout.mapping":"/js/knockout.mapping.2.4.1.min",ReceivedOrders:"/js/received-orders",ReckoningOrders:"/js/reckoning-orders",IncomeList:"/js/income-list",Addresses:"/js/addresses",ItemsModel:"/js/purchase-items",swiper:"swiper/dist/js/swiper.jquery.min",colorbox:"jquery-colorbox/jquery.colorbox-min"},shim:{swiper:["jquery"],"knockout.mapping":["knockout"],colorbox:["jquery"]}}),require(["ReceivedOrders","knockout","jquery","swiper"],function(e,n,o,t){var s="ontouchstart"in document.documentElement?"touchstart":"click",i=o.fn.on;o.fn.on=function(){return arguments[0]="click"===arguments[0]?s:arguments[0],i.apply(this,arguments)},n.bindingHandlers.tap={init:function(e,n,t,s,i){var r=n();o(e).on("click",function(e){var n=o(e.target),t=o(".prompt-submitting"),s=o(".prompt-succeed"),a=o(".confirm");if(n.hasClass("action-delete")&&n.hasClass("action-submit")){var c=n.offset();o(".confirm-submit").one("click",function(){a.fadeOut("slow"),r(i.$data,i.$parent,e,function(){t.children("span").text("Submitting...");var e=n.offset();o(".prompt").css("top",e.top).show()},function(){t.addClass("disappeared"),s.removeClass("disappeared"),o(".prompt").delay(600).fadeOut("slow",function(){t.removeClass("disappeared"),s.addClass("disappeared")})})}),o(".confirm-cancel").one("click",function(){a.fadeOut("slow")}),o(".confirm").css("top",c.top).fadeIn("slow")}else n.hasClass("action-submit")?setTimeout(function(){r(i.$data,i.$parent,e,function(){t.children("span").text("Submitting...");var e=n.offset();o(".prompt").css("top",e.top).show()},function(){t.addClass("disappeared"),s.removeClass("disappeared"),o(".prompt").delay(1200).fadeOut("slow",function(){t.removeClass("disappeared"),s.addClass("disappeared")})})},100):n.hasClass("action-load")?r(i.$data,i.$parent,e,function(){t.children("span").text("Loading...");var e=n.offset();o(".prompt").css("top",e.top).show()},function(){o(".prompt").delay(600).fadeOut("slow")}):r(i.$data,i.$parent,e);return!1})},update:function(e,n,o,t,s){}};var r=new e(orders);n.applyBindings(r,o("#receivedOrders")[0]);var a=new t(".swiper-container",{autoHeight:!0,spaceBetween:30,pagination:".swiper-pagination",paginationClickable:!0,simulateTouch:!1,shortSwipes:!1,longSwipes:!1,paginationBulletRender:function(e,n){var o="";switch(e){case 0:o="接单";break;case 1:o="采购";break;case 2:o="算账";break;case 3:o="收益"}return'<span class="'+n+'">'+o+"</span>"}});r.setSwiper(a),o(window).scroll(function(){var e=o(window).scrollTop();o(".searchbox").css("top",e)}),require(["ItemsModel","ReckoningOrders","IncomeList","Addresses","knockout","jquery"],function(e,n,o,t,s,i){var c,d,p,u;i.getJSON("./purchaseItemsJson",function(n,o){c=new e(n.items,n.markedItems,a),s.applyBindings(c,i("#purchaseItems")[0])}),i.getJSON("./reckoningOrdersJson",function(e,o){d=new n(e,a),s.applyBindings(d,i("#reckoningOrders")[0])}),i.getJSON("./incomeListJson",function(e,n){p=new o(e,a),s.applyBindings(p,i("#incomeList")[0])}),i(document).on("keydown",function(e){if(13==e.keyCode&&(0==a.activeIndex||2==a.activeIndex)){i(document.activeElement).blur();var n=0==a.activeIndex?"receivedOrders":"reckoningOrders",o=i("#"+n+" .action-enter");return setTimeout(function(){o.trigger("click")},100),!1}}),a.params.onSlideChangeStart=function(e){switch(e.activeIndex){case 0:i.getJSON("./receivedOrdersJson",function(n,o){r.setOrders(n),e.update()});break;case 1:i.getJSON("./purchaseItemsJson",function(n,o){c.setItems(n.items,n.markedItems),e.update()});break;case 2:i.getJSON("./reckoningOrdersJson",function(n,o){var t=d.getObservableOrders(n);d.orders(t),e.update()});break;case 3:i.getJSON("./incomeListJson",function(n,o){p.setIncomeList(n),e.update()});break;case 4:i.getJSON("./addressesJson",function(n,o){u.setAddresses(n),e.update()})}i(window).scrollTop(0)}}),require(["jquery","colorbox"],function(e,n){e(".icon-cog").colorbox({iframe:!0,width:335,height:200,scrolling:!1,close:"",top:0,onComplete:function(){setInterval(function(){var n=e(".cboxIframe")[0];if(n){var o=n.contentDocument||n.document,t=Math.max(o.body?o.body.clientHeight:0,o.documentElement.scrollHeight);t=t<200?200:t,e.colorbox.resize({height:t})}},200)}}),e(window).scroll(function(){var n=e(window).scrollTop();e(".cogbox").css("top",n+10)})})});
//# sourceMappingURL=main.js.map
