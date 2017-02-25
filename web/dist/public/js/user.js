"use strict";define(["jquery"],function(n){return{getUser:function(){var t=new Promise(function(t,e){n.getJSON("./user",{id:USER_ID},function(n,e){t(n)})});return t.catch(function(n){}),t},updateTags:function(t){n.post("/userTags",{tags:t},function(n,t){},"json")}}});
//# sourceMappingURL=user.js.map
