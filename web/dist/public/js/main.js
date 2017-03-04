"use strict";requirejs.config({baseUrl:"./components",paths:{jquery:"./jquery/dist/jquery.min",knockout:"./knockout/dist/knockout","knockout.mapping":"../js/knockout.mapping.2.4.1.min",ReceivedOrders:"../js/received-orders",ReckoningOrders:"../js/reckoning-orders",IncomeList:"../js/income-list",Addresses:"../js/addresses",ItemsModel:"../js/purchase-items",swiper:"./swiper/dist/js/swiper.jquery.min",colorbox:"./jquery-colorbox/jquery.colorbox-min",angular:"./angular/angular.min",ngResource:"./angular-resource/angular-resource.min",ngAnimate:"./angular-animate/angular-animate.min","settings.component":"../js/settings/settings.min"},shim:{swiper:["jquery"],"knockout.mapping":["knockout"],colorbox:["jquery"],angular:{exports:"angular"},ngResource:{deps:["angular"],exports:"angular"},ngAnimate:{deps:["angular"],exports:"angular"}}}),require(["ReceivedOrders","knockout","jquery","swiper"],function(e,n,t,s){function o(){0==p.activeIndex&&t.getJSON("./receivedOrdersJson",function(e,n){l.setOrders(e),setTimeout(function(){p.update()},100)}),2==p.activeIndex&&t.getJSON("./reckoningOrdersJson",function(e,n){var t=u.getObservableOrders(e);u.orders(t),setTimeout(function(){p.update()},100)})}function i(){0!=p.activeIndex&&t.getJSON("./receivedOrdersJson",function(e,n){l.setOrders(e),setTimeout(function(){p.update()},100)}),1!=p.activeIndex&&t.getJSON("./purchaseItemsJson",function(e,n){c.setItems(e.items,e.markedItems),setTimeout(function(){p.update()},100)}),2!=p.activeIndex&&t.getJSON("./reckoningOrdersJson",function(e,n){var t=u.getObservableOrders(e);u.orders(t),setTimeout(function(){p.update()},100)}),3!=p.activeIndex&&(t.getJSON("./incomeListJson",function(e,n){d.setIncomeList(e)}),setTimeout(function(){p.update()},100))}var r="ontouchstart"in document.documentElement?"touchstart":"click",a=t.fn.on;t.fn.on=function(){return arguments[0]="click"===arguments[0]?r:arguments[0],a.apply(this,arguments)},n.bindingHandlers.tap={init:function(e,n,s,r,a){var c=n();t(e).on("click",function(e){var n=t(e.target),s=t(".prompt-submitting"),r=t(".prompt-succeed"),u=t(".confirm");if(n.hasClass("action-delete")&&n.hasClass("action-submit")){var d=n.offset();t(".confirm-submit").one("click",function(){u.fadeOut("slow"),c(a.$data,a.$parent,e,function(){s.children("span").text("Submitting...");var e=n.offset();t(".prompt").css("top",e.top).show()},function(){s.addClass("disappeared"),r.removeClass("disappeared"),t(".prompt").delay(600).fadeOut("slow",function(){s.removeClass("disappeared"),r.addClass("disappeared")}),i()})}),t(".confirm-cancel").one("click",function(){u.fadeOut("slow")}),t(".confirm").css("top",d.top).fadeIn("slow")}else if(n.hasClass("action-submit")){var l=t(document.activeElement);l.hasClass("action-submit")||l.blur(),setTimeout(function(){c(a.$data,a.$parent,e,function(){s.children("span").text("Submitting...");var e=n.offset();t(".prompt").css("top",e.top).show()},function(e,n){s.addClass("disappeared"),r.removeClass("disappeared"),t(".prompt").delay(1200).fadeOut("slow",function(){s.removeClass("disappeared"),r.addClass("disappeared")}),n&&o(),e&&i()})},100)}else n.hasClass("action-load")?c(a.$data,a.$parent,e,function(){s.children("span").text("Loading...");var e=n.offset();t(".prompt").css("top",e.top).show()},function(){t(".prompt").delay(600).fadeOut("slow"),p.update()}):c(a.$data,a.$parent,e);return!1})},update:function(e,n,t,s,o){}};var c,u,d,p=new s(".swiper-container",{autoHeight:!0,spaceBetween:30,pagination:".swiper-pagination",paginationClickable:!0,simulateTouch:!1,shortSwipes:!1,longSwipes:!1,paginationBulletRender:function(e,n){var t="";switch(e){case 0:t="接单";break;case 1:t="采购";break;case 2:t="算账";break;case 3:t="收益"}return'<span class="'+n+'">'+t+"</span>"}}),l=new e(orders);n.applyBindings(l,t("#receivedOrders")[0]),l.setSwiper(p),require(["ItemsModel","ReckoningOrders","IncomeList","Addresses","knockout","jquery"],function(e,n,t,s,o,i){i.getJSON("./purchaseItemsJson",function(n,t){c=new e(n.items,n.markedItems,p),o.applyBindings(c,i("#purchaseItems")[0])}),i.getJSON("./reckoningOrdersJson",function(e,t){u=new n(e,p),o.applyBindings(u,i("#reckoningOrders")[0])}),i.getJSON("./incomeListJson",function(e,n){d=new t(e,p),o.applyBindings(d,i("#incomeList")[0])}),i(document).on("keydown",function(e){if(13==e.keyCode&&(0==p.activeIndex||2==p.activeIndex)){i(document.activeElement).blur();var n=0==p.activeIndex?"receivedOrders":"reckoningOrders",t=i("#"+n+" .action-enter");return setTimeout(function(){t.trigger("click")},100),!1}}),p.params.onSlideChangeStart=function(e){setTimeout(function(){i(window).scrollTop(0)},100)}}),require(["jquery","angular","settings.component","colorbox"],function(e,n){n.bootstrap(e("#settings")[0],["settings"]),e(".icon-cog").colorbox({inline:!0,width:335,height:200,scrolling:!1,close:"",top:0,onComplete:function(){setInterval(function(){e.colorbox.resize()},200)}}),e(window).scroll(function(){var n=e(window).scrollTop();e(".cogbox").css("top",n+10),e(".swiper-pagination").css("top",n),e(".searchbox").css("top",n)})})});
//# sourceMappingURL=main.js.map
