define(['commonAngular'], function(angular) {

    angular.module('registration', ['ngResource', 'ngAnimate']);

    angular.module('registration').component('registration', {
        templateUrl: './js/registration/registration.template.html',
        controller: ['$resource', function($resource) {

            var User = $resource('./user/:_id');

            var self = this;
            self.name = '';
            self.password = '';
            self.passwordConfirmation = '';
            self.saved = false;
            self.isOpen = false;
            self.isLegalName = true;
            self.isLegalPassword = true;
            self.isConfirmed = true;

            self.registerToggle = function() {
                self.isOpen = !self.isOpen;

                self.statusClass = self.isOpen ? 'isActive' : '';
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

                        self.saved = true;

                        //console.log(`New user: ${rs}`)

                    });
                }



            }

        }]
    });

    return angular;


});

