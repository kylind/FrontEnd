describe('Settings controller', function() {
    var $injector, settings;

    beforeEach(function(done) {
        angular.module('settings');
        angular.module('ngMock');
        $injector = angular.injector(['ng', 'ngMock', 'settings']);

        $injector.invoke(function($componentController) {

            settings = $componentController('settings');
            done();

        });

    });


    it('should have "saved" property, its value is false by default', function() {
        expect(settings.saved).toBeFalsy();
    });

    it('should find user by id', function(done) {

        var promise=settings.findUser('57a94cff8bcabf9155df7afb');

        promise.then(function(user){
            expect(user._id).toBe('57a94cff8bcabf9155df7afb');
            expect(user.name).toEqual('yolanda');
            done();

        })

    }, 10000);




});
