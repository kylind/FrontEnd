define(['common', 'commonAngular'], function(util, angular) {

    var $ = util.$;

    angular.module('registration', ['ngResource', 'ngAnimate']);

    angular.module('registration').component('registration', {
        templateUrl: './js/registration/registration.template.html',
        controller: ['$scope', '$resource', function($scope, $resource) {

            var User = $resource('./user/:_id');

            var self = this;
            self.name = '';
            self.password = '';

            self.loginName = '';
            self.loginPassword = '';

            self.passwordConfirmation = '';

            self.logged = false;
            self.isLegalName = true;
            self.isLegalPassword = true;
            self.isConfirmed = true;
            self.loginStatus = 'isActive';
            self.loginBtnStatus='isActive';

            self.login = function() {
                self.registrationStatus = '';
                self.loginStatus = 'isActive';
                self.successStatus = '';
                self.loginBtnStatus='isActive';
                self.registrationBtnStatus='';
            }

            self.register = function() {
                self.registrationStatus = 'isActive';
                self.loginStatus = '';
                self.successStatus = '';
                self.loginBtnStatus='';
                self.registrationBtnStatus='isActive';
            }

            self.verifyName = function() {
                var regex = /^[a-zA-Z]{6,}$/;
                self.isLegalName = regex.test(self.name);
            }
            self.verifyPassword = function() {
                var regex = /^(?!([a-zA-Z]+|\d+)$)[\S]{8,}$/;
                self.isLegalPassword = regex.test(self.password);
            }
            self.verifyConfirmPassword = function() {
                self.isConfirmed = self.password == self.passwordConfirmation;
            }

            self.saveUser = function() {

                if (self.isLegalName && self.isConfirmed && self.isLegalPassword && self.password != "") {
                    var user = { name: self.name, password: self.password };

                    User.save(null, user).$promise.then(function(rs) {


                        self.registrationStatus = '';
                        self.loginStatus = '';
                        self.successStatus = 'isActive';

                    });
                }

            }

            self.verifyUser = function() {
                $.post('./login', {
                        username: self.loginName,
                        password: self.loginPassword
                    }, function(res, status) {
                        if (res.success) {

                            $scope.$apply(function() {
                                self.logged = true;
                                $('.mask').addClass('isShow');

                            });

                            $.get('./content', function(rs, status) {
                                setTimeout(function(){
                                     $('#container').html(rs);
                                },300);

                            }, 'html')

                        }
                    },
                    'json'
                );
            }
        }]
    });

    return angular;


});
