define(function(require) {


    return function run() {

        var angular = require('registration');

        var runSettings = require('settings');

        runSettings();

        return angular;
    };



});
