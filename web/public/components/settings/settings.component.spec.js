describe('Settings', function() {
    var USER_ID = '57a94cff8bcabf9155df7afb';
    beforeEach(function(){
        module('settings');

    });

    describe('Settings controller', injector(function( $componentController) {

        it('should be', function(){
            var ctrl = $componentController('settings');
            expect(ctrl.isSaved).toBe(false);

        } );

    }));
})
