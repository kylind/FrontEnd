define(['commonAngular'], function(angular) {

    angular.module('settings', ['ngResource', 'ngAnimate']);

    var userId = USER_ID || '';

    angular.module('settings').constant('USER_ID', userId);

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
                            scope.isLegal = floatRegex.test(value);
                            break;
                        case 'password':
                            scope.isLegal = value == '' ? true : passwordRegex.test(value);
                            break;
                        case 'password-confirm':
                            scope.isLegal = value == '' ? true : value == scope.comparingValue;
                            break;

                    }

                    scope.onValidate({ targetName: scope.targetName, targetValue: scope.targetValue, isLegal: scope.isLegal })


                });

            },

            controller: function($scope, $element, $attrs, $transclude) {


            },
            scope: {
                targetName: '@',
                targetType: '@',
                targetValue: '@',
                comparingValue: '@?',
                onValidate: '&'
            },
            transclude: true,
            templateUrl: "./js/settings/validation.template.html"
        }
    });

    angular.module('settings').service('userService', function($resource) {
        var User = $resource('./user/:_id');
        this.findUser = function(id) {
            var user = User.get({ _id: id });
            return user.$promise;
        };

        this.saveUser = function(user) {
            User.save(user);
        }

    });

    angular.module('settings').component('tagmgr', {
        templateUrl: './js/settings/tagmgr.template.html',
        controller: ['$scope', function($scope) {
            var self = this;

            self.newTag = '';

            self.addTag = function() {
                if (self.newTag != '') {
                    if (Array.isArray(self.tags)) {
                        self.tags.unshift(self.newTag);
                    } else {
                        self.tags = [self.newTag];
                    }
                }

                self.newTag = '';

                self.onUpdate({ tags: self.tags });

            };
            self.removeTag = function(tag) {

                var removeIndex = self.tags.indexOf(tag);

                if (removeIndex >= 0) {
                    self.tags.splice(removeIndex, 1);
                }

                self.onUpdate({ tags: self.tags });

            };
        }],
        bindings: {
            tags: "<tags",
            onUpdate: "&"
        },
        transclude: true
    });


    angular.module('settings').component('settings', {
        templateUrl: './js/settings/settings.template.html',
        controller: ['$scope', 'userService', 'USER_ID', function($scope, userService, id) {
            var self = this;


            self.passwordConfirmation = '';

            self.myClasses = '';

            var verifiedRS = {};
            self.validate = function(name, value, isLegal) {

                verifiedRS[name] = isLegal;

            };

            userService.findUser(id).then(function(user) {
                self.user = user;
                self.user.password = '';
                self.user.tags = self.user.tags ? self.user.tags : [];
            });


            self.saveUser = function() {

                var isReady = true;

                for (let prop in verifiedRS) {
                    if (!verifiedRS[prop]) {
                        isReady = false;
                        break;
                    }
                }

                if (isReady) {

                    self.myClasses = 'isActive';

                    self.user.$save().then(function(rs) {

                        self.myClasses = 'isSuccess';

                        $.fn.tag.setTags(self.user.tags);

                        setTimeout(function() {
                            $scope.$apply(function() {
                                self.myClasses = '';
                            });

                        }, 900)

                    });



                }

                return false;
            }

        }]
    });

    return angular;

});
