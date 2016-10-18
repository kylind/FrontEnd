angular.module('settings', []).directive('myValidation', function() {

    return {

        link: function(scope, iElement, iAttrs, controller) {
            var floatRegex = /^\d?\.?\d+$/;

            var target = iAttrs.targetId;
            var type = iAttrs.targetType;

            scope.isLegal = true;

            scope.$watch(scope.targetValue, function(value) {

                if (type == 'float') {
                    if (value == '') {
                        scope.isLegal = true;
                    } else {
                        scope.isLegal = floatRegex.test(value);
                    }

                } else {

                }

            });

        },

        controller: function($scope, $element, $attrs, $transclude) {


        },
        scope: {
            targetId: '<targetId',
            targetType: '@',
            targetValue: '@',

        },
        transclude: true,
        templateUrl: "/components/settings/validation.template.html"
    }
});







angular.module('settings').component('settings', {
    templateUrl: '/components/settings/settings.template.html',
    controller: [function() {


        var self = this;
        self.rate = '9';
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
