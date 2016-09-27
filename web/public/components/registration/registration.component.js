angular.module('registration').component('registration', {
    templateUrl: '/components/registration/registration.template.html',
    controller: ['$resource', function($resource) {

        var User = $resource('/user/:_id');

        var self= this;
        self.name='kylin';
        self.password='';
        self.passwordConfirmation='';
        self.saved=false;

        self.saveUser = function (){

            var user = { name: self.name, password: self.password, status:'0NEW'};

/*            User.save(null, user, function(rs){
                self.saved=true;

                console.log(`New user: ${rs}`)

            })*/

              User.save(null, user).$promise.then(function(rs){
                 self.saved=true;

                 console.log(`New user: ${rs}`)

              });

        }

    }]
});


// <span>Hello, {{ $ctrl.name }}</span>
