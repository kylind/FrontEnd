"use strict";requirejs.config({baseUrl:"./components",paths:{jquery:"./jquery/dist/jquery.min",knockout:"./knockout/dist/knockout","knockout.mapping":"../js/knockout.mapping.2.4.1.min",ReceivedOrders:"../js/received-orders",ReckoningOrders:"../js/reckoning-orders",IncomeList:"../js/income-list",Addresses:"../js/addresses",ItemsModel:"../js/purchase-items",swiper:"./swiper/dist/js/swiper.jquery.min",colorbox:"./jquery-colorbox/jquery.colorbox-min",tag:"../js/jquery.tag",angular:"./angular/angular.min",ngResource:"./angular-resource/angular-resource.min",ngAnimate:"./angular-animate/angular-animate.min","settings.component":"../js/settings/settings.min"},shim:{swiper:["jquery"],"knockout.mapping":["knockout"],colorbox:["jquery"],tag:["jquery"],angular:{exports:"angular"},ngResource:{deps:["angular"],exports:"angular"},ngAnimate:{deps:["angular"],exports:"angular"}}}),require(["ReceivedOrders","knockout","jquery","swiper"],function(e,n,t,s){function o(e){switch(e){case 0:u[1]=!0,u[2]=!0;break;case 1:u[0]=!0,u[2]=!0;break;case 2:u[0]=!0,u[1]=!0,u[3]=!0}}function i(){0==g.activeIndex&&t.getJSON("./receivedOrdersJson",function(e,n){m.setOrders(e,!0),setTimeout(function(){g.update()},100)}),2==g.activeIndex&&t.getJSON("./reckoningOrdersJson",function(e,n){var t=p.getObservableOrders(e);p.orders(t),setTimeout(function(){g.update()},100)})}function r(){var e=g.activeIndex;1!=e&&2!=e||t.getJSON("./receivedOrdersJson",function(e,n){m.setOrders(e,!0),setTimeout(function(){g.update()},100)}),0!=e&&2!=e||t.getJSON("./purchaseItemsJson",function(e,n){d.setItems(e.items,!0,!0),setTimeout(function(){g.update()},100)}),0!=e&&1!=e||t.getJSON("./reckoningOrdersJson",function(e,n){var t=p.getObservableOrders(e);p.orders(t),setTimeout(function(){g.update()},100)}),2==e&&(t.getJSON("./incomeListJson",function(e,n){l.setIncomeList(e)}),setTimeout(function(){g.update()},100))}var a="ontouchstart"in document.documentElement?"touchstart":"click",c=t.fn.on;t.fn.on=function(){return arguments[0]="click"===arguments[0]?a:arguments[0],c.apply(this,arguments)};var u=[!1,!1,!1,!1];n.bindingHandlers.tap={init:function(e,n,s,a,c){var u=n();t(e).on("click",function(e){var n=t(e.target),s=t(".prompt-submitting"),a=t(".prompt-succeed"),d=t(".confirm");if(n.hasClass("action-delete")&&n.hasClass("action-submit")){var p=n.offset();t(".confirm-submit").one("click",function(){d.fadeOut("slow"),u(c.$data,c.$parent,e,function(){s.children("span").text(" 提交中...");var e=n.offset();t(".prompt").css("top",e.top).show()},function(e){s.addClass("disappeared"),a.removeClass("disappeared"),t(".prompt").delay(600).fadeOut("slow",function(){s.removeClass("disappeared"),a.addClass("disappeared")}),o(g.activeIndex),e&&r()})}),t(".confirm-cancel").one("click",function(){d.fadeOut("slow")}),t(".confirm").css("top",p.top).fadeIn("slow")}else if(n.hasClass("action-submit")){var l=t(document.activeElement);l.hasClass("action-submit")||l.blur(),setTimeout(function(){u(c.$data,c.$parent,e,function(){s.children("span").text(" 提交中...");var e=n.offset();t(".prompt").css("top",e.top).show()},function(e,n){o(g.activeIndex),s.addClass("disappeared"),a.removeClass("disappeared"),t(".prompt").delay(1200).fadeOut("slow",function(){s.removeClass("disappeared"),a.addClass("disappeared")}),n&&i(),e&&r()})},100)}else n.hasClass("action-load")?u(c.$data,c.$parent,e,function(){s.children("span").text(" 加载中...");var e=n.offset();t(".prompt").css("top",e.top).show()},function(){t(".prompt").delay(600).fadeOut("slow"),g.update()}):u(c.$data,c.$parent,e);return!1})},update:function(e,n,t,s,o){}};var d,p,l,g=new s(".swiper-container",{autoHeight:!0,spaceBetween:30,pagination:".swiper-pagination",paginationClickable:!0,simulateTouch:!1,shortSwipes:!1,longSwipes:!1,paginationBulletRender:function(e,n){var t="";switch(e){case 0:t="接单";break;case 1:t="采购";break;case 2:t="算账";break;case 3:t="收益"}return'<span class="'+n+'">'+t+"</span>"}}),m=new e(orders);n.applyBindings(m,t("#receivedOrders")[0]),m.setSwiper(g),require(["ItemsModel","ReckoningOrders","IncomeList","Addresses","knockout","jquery","tag"],function(e,n,t,s,i,r){var a=new Promise(function(n,t){r.getJSON("./purchaseItemsJson",function(t,s){d=new e(t.items,g),n(d),i.applyBindings(d,r("#purchaseItems")[0]);var a=new Promise(function(e,n){r.getJSON("./user/"+USER_ID,function(n,t){e(n)})});a.catch(function(e){}),a.then(function(e){var n=Array.isArray(e.tags)?e.tags:[];r(".hidden-tag").tag({tags:n,updateTag:function(e,n,t){if(n!=t){if(Array.isArray(d.allItems)&&d.allItems.length>0){var s=d.allItems.find(function(n){return n._id==e});if(s.tag=t,s){var i=[];d.allItems.forEach(function(e){i.indexOf(e.tag)<0&&e.tag&&i.push(e.tag)}),d.tags(i)}}r.post("./itemtag",{itemName:e,oldTag:n,newTag:t},function(e,n){o(g.activeIndex)},"json")}}})})})}),c=new Promise(function(e,t){r.getJSON("./reckoningOrdersJson",function(t,s){p=new n(t,g),e(p),i.applyBindings(p,r("#reckoningOrders")[0])})});Promise.all([a,c]).then(function(e){}),r.getJSON("./incomeListJson",function(e,n){l=new t(e,g),i.applyBindings(l,r("#incomeList")[0])}),r(document).on("keydown",function(e){if(13==e.keyCode&&(0==g.activeIndex||2==g.activeIndex)){r(document.activeElement).blur();var n=0==g.activeIndex?"receivedOrders":"reckoningOrders",t=r("#"+n+" .action-enter");return setTimeout(function(){t.trigger("click")},100),!1}}),g.params.onSlideChangeStart=function(e){var n=e.activeIndex;switch(e.activeIndex){case 0:u[n]&&r.getJSON("./receivedOrdersJson",function(e,t){m.setOrders(e,!0),u[n]=!1});break;case 1:u[n]&&r.getJSON("./purchaseItemsJson",function(e,t){d.setItems(e.items,!0,!0),u[n]=!1});break;case 2:u[n]&&r.getJSON("./reckoningOrdersJson",function(e,t){var s=p.getObservableOrders(e);p.orders(s),u[n]=!1});break;case 3:u[n]&&r.getJSON("./incomeListJson",function(e,t){l.setIncomeList(e),u[n]=!1})}setTimeout(function(){r(window).scrollTop(0)},100)}}),require(["jquery","angular","settings.component","colorbox"],function(e,n){n.bootstrap(e("#settings")[0],["settings"]),e(".icon-cog").colorbox({inline:!0,width:335,height:200,scrolling:!1,close:"",top:0,onComplete:function(){setInterval(function(){e.colorbox.resize()},200)}}),e(window).scroll(function(){var n=e(window).scrollTop();e(".cogbox").css("top",n+10),e(".swiper-pagination").css("top",n),e(".searchbox").css("top",n)})})});
//# sourceMappingURL=main.js.map
