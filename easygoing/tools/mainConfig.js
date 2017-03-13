requirejs.config({

    baseUrl: './components',

    paths: {

        'jquery': './jquery/dist/jquery.min',
        'knockout': './knockout/dist/knockout',
        'knockout.mapping': '../js/knockout.mapping.2.4.1.min',
        'ReceivedOrders': '../js/received-orders',
        'ReckoningOrders': '../js/reckoning-orders',
        'IncomeList': '../js/income-list',
        'ItemsModel': '../js/purchase-items',
        'swiper': './swiper/dist/js/swiper.jquery.min',
        'colorbox': './jquery-colorbox/jquery.colorbox-min',
        'tag': '../js/jquery.tag',
        'angular': './angular/angular.min',
        'ngResource': './angular-resource/angular-resource.min',
        'ngAnimate': './angular-animate/angular-animate.min',
        'settings.component': '../js/settings/settings.min'
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