angular.module('settings').directive('myValidation', function() {

    return {

        link: function(scope, iElement, iAttrs, controller) {
            var floatRegex = /^\d?\.?\d+$/;
            var passwordRegex = /^(?!([a-zA-Z]+|\d+)$)[\S]{8,}$/;

            var target = iAttrs.targetId;
            var type = iAttrs.targetType;

            scope.isLegal = true;

            scope.$watch('targetValue', function(value, oldValue) {

                switch (type) {

                    case 'float':
                        scope.isLegal = value == '' ? true : floatRegex.test(value);
                        break;
                    case 'password':
                        scope.isLegal = value == '' ? true : passwordRegex.test(value);
                        break;
                    case 'password-confirm':
                        scope.isLegal = value == '' ? true : value == scope.comparingValue;
                        break;

                }

            });

        },

        controller: function($scope, $element, $attrs, $transclude) {


        },
        scope: {
            targetType: '@',
            targetValue: '@',
            comparingValue: '@?'
        },
        transclude: true,
        templateUrl: "/components/settings/validation.template.html"
    }
});


angular.module('settings').component('settings', {
    templateUrl: '/components/settings/settings.template.html',
    controller: ['$scope','$resource', 'USER_ID', function($scope,$resource, id) {
        var self = this;
        var User = $resource('/user/:_id');

        var user=User.get({ _id: id });
        user.$promise.then(function(user) {
/*            self._id = user._id;
            self.rate = user.rate;
            self.buyComputing = user.buyComputing;
            self.sellComputing = user.sellComputing;*/
            self.user=user;
            self.user.password = '';
        })


        self.passwordConfirmation = '';
        self.saved = false;
        self.isLegalName = true;
        self.isLegalPassword = true;
        self.isConfirmed = true;
        self.myClasses='';


        self.saveUser = function() {

            self.myClasses='isActive';

            user.$save().then(function(rs){

                self.myClasses='isSuccess';

                setTimeout(function(){
                    $scope.$apply(function(){
                        self.myClasses='';
                    });

                },900)

            });
            return false;


        }

    }]
});


// <span>Hello, {{ $ctrl.name }}</span>
