angular.module('registration').component('registration', {
    templateUrl: '/components/registration/registration.template.html',
    controller: ['$resource', function($resource) {

        var User = $resource('/user/:_id');

        var self = this;
        self.name = '';
        self.password = '';
        self.passwordConfirmation = '';
        self.saved = false;
        self.isLegalName = true;
        self.isLegalPassword = true;
        self.isConfirmed = true;

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

            if (self.isLegalName && self.isConfirmed && self.isLegalPassword) {
                var user = { name: self.name, password: self.password, status: '0NEW' };

                /*            User.save(null, user, function(rs){
                                self.saved=true;

                                console.log(`New user: ${rs}`)

                            })*/

                User.save(null, user).$promise.then(function(rs) {

                    self.saved = true;

                    console.log(`New user: ${rs}`)

                });
            }



        }

    }]
});


// <span>Hello, {{ $ctrl.name }}</span>