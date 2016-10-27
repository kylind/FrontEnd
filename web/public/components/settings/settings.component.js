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
    controller: ['$resource',function($resource) {
var self = this;
        var User = $resource('/user/:_id');

        /*User.get({_id:''}).$promise.then(function(user){
            self._id = user._id;
            self.rate=user.rate;
            self.buyComputing=user.buyComputing;
            self.sellComputing=user.sellComputing;
        })*/

        self.password = '';
        self.passwordConfirmation = '';

        self.saved = false;
        self.isLegalName = true;
        self.isLegalPassword = true;
        self.isConfirmed = true;



        self.saveUser = function() {


        }

    }]
});


// <span>Hello, {{ $ctrl.name }}</span>
