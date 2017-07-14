define(['angularApp'], function(angularApp) {

    return function(){

        let angular=angularApp();

        angular.bootstrap(document.getElementById('registration'), ['registration']);
    }


});