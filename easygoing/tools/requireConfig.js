requirejs.config({

    baseUrl: './components',

    paths: {

        'common': '../js/common',
        'tag': '../js/jquery.tag',
        'jquery': './jquery/dist/jquery.min',
        'knockout': './knockout/dist/knockout',
        'knockout.mapping': '../js/knockout.mapping.2.4.1.min',
        'swiper': './swiper/dist/js/swiper.jquery.min',
        'colorbox': './jquery-colorbox/jquery.colorbox-min',

        'ReceivedOrders': '../js/received-orders',
        'ReckoningOrders': '../js/reckoning-orders',
        'IncomeList': '../js/income-list',
        'ItemsModel': '../js/purchase-items',

        'commonAngular': '../js/commonAngular',
        'angular': './angular/angular',
        'ngResource': './angular-resource/angular-resource.min',
        'ngAnimate': './angular-animate/angular-animate.min',
        'settings': '../js/settings/settings.component',
        'registration': '../js/registration/registration.component'
    },
    shim: {
        'swiper': ['jquery'],
        'knockout.mapping': ['knockout'],
        'colorbox': ['jquery'],
        'tag': ['jquery'],

        'angular': {
            exports: 'angular'
        },
        'ngResource': {
            deps: ['angular'],
            exports: 'angular'
        },
        'ngAnimate': {
            deps: ['angular'],
            exports: 'angular'
        },
    }

});