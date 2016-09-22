angular.module('registration', ['ngResource']);
angular.module('registration').controller('registrationController', function($scope){

    $scope.name='Yolanda';
    $scope.saveUser=function(){
        console.log($scope.name);
    }

})
