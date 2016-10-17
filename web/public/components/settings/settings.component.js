angular.module('settings', []).directive('myValidation', function() {

    return {

        link: function preLink(scope, ele, attrs, controller) {
            var floatRegex = /^\d?\.?\d+$/;

            var target = attrs.targetId;
            var type = attrs.type;

            scope.isLegal = true;

            if (type == 'float') {

                $('#' + target).on('blur', function() {
                    var floatValue = $(this).val();
                    if (floatValue == '') {
                        scope.isLegal = true;
                    } else {
                        scope.isLegal = floatRegex.test(floatValue);
                    }

                })

            } else {

            }

        },
        scope: {
            targetId: '@targetId',
            type: '@'

        },
        transclude: true,
        templateUrl: "/components/settings/validation.template.html"
    }
});







angular.module('settings').component('settings', {
    templateUrl: '/components/settings/settings.template.html',
    controller: [function() {


        var self = this;
        self.rate = '';
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
