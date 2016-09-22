angular.module('registration').component('registration', {
    templateUrl: '/components/registration/registration.template.html',
    controller: function() {

        var self= this;
        self.name='kylin';
        self.password='';
        self.passwordConfirmation='';
        self.saved=false;

        self.saveUser = function (){

            var user = { name: self.name, password: self.password};
            self.saved=true;

            if(self.saved){

                console.log(`New user: ${user.name}`)

            }

        }

    }
});


// <span>Hello, {{ $ctrl.name }}</span>
