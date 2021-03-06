requirejs.config({

    baseUrl: './components',

    paths: {

        'common': '../js/common',
        'tag': '../js/jquery.tag',
        'dropdown': '../js/jquery.dropdown',
        'jquery': './jquery/dist/jquery.min',
        'knockout': './knockout/dist/knockout.debug',
        'knockout.mapping': '../js/knockout.mapping.2.4.1.min',
        'swiper': './swiper/dist/js/swiper.jquery.min',
        'colorbox': './jquery-colorbox/jquery.colorbox-min',
        'clipboard': './clipboard/dist/clipboard',

        'ReceivedOrders': '../js/received-orders',
        'ReckoningOrders': '../js/reckoning-orders',
        'IncomeList': '../js/income-list',
        'ItemsModel': '../js/purchase-items',
        'ClientsModel': '../js/clients',
        'ProductsModel': '../js/products',

        'commonAngular': '../js/common-angular',
        'angularApp': '../js/angular-app',
        'angular': './angular/angular.min',
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
        'dropdown': ['jquery'],

        'clipboard':{
            exports: 'Clipboard'
        },

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




