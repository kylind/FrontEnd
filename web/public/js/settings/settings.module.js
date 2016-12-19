
define(['angular'],function(){

    angular.module('settings', ['ngResource','ngAnimate']);

    var userId = USER_ID || '';

    angular.module('settings').constant('USER_ID', userId );

})



