describe('Settings controller', function() {
    var $injector, settings, scope, deferred;

    beforeEach(function() {
        module('settings');

        inject(function($componentController, $q, $rootScope,userService) {

            deferred = $q.defer();
            spyOn(userService, 'findUser').and.returnValue(deferred.promise);

            settings = $componentController('settings',{userService: userService});

            scope = $rootScope.$new();

        });

    });


    it('should have "saved" property, its value is false by default', function() {
        expect(settings.saved).toBeFalsy();
    });

    it('should find user by id', function() {

        deferred.resolve({ name: 'yolanda' })

        scope.$apply();

        expect(settings.user).toBeDefined();
        expect(settings.user.name).toBe('yolanda');

    });

});
