define(['angularApp'], function(angularApp) {

    return function(){

        var angular=angularApp();

        angular.bootstrap(document.getElementById('registration'), ['registration']);
    }


});