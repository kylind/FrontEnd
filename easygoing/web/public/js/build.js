/*
({
    baseUrl: "public/js",
    appDir: "../../",
    dir: "../../dist",
    modules: [{
        paths: {
            jquery: '../components/jquery/dist/jquery.min',
            'knockout': '../components/knockout/dist/knockout',
            'knockout.mapping': './knockout.mapping.2.4.1.min',
            'swiper': '../components/Swiper/dist/js/swiper.jquery.min',

            'ReceivedOrders': './received-orders',
            'ReckoningOrders': './reckoning-orders',
            'IncomeList': './income-list',
            'Addresses': './addresses',
            'ItemsModel': './purchase-items'
        },
        name: "main"
    }]
})


({
    baseUrl: ".",

    paths: {
        jquery: '../components/jquery/dist/jquery.min',
        'knockout': '../components/knockout/dist/knockout',
        'knockout.mapping': 'knockout.mapping.2.4.1.min',
        'swiper': '../components/Swiper/dist/js/swiper.jquery.min',

        'ReceivedOrders': './received-orders',
        'ReckoningOrders': './reckoning-orders',
        'IncomeList': './income-list',
        'Addresses': './addresses',
        'ItemsModel': './purchase-items'
    },

    modules: [{

        name: "main"
    }, {
        name: 'main-received'
    }],
    dir: "../../dist/public/js"

})
*/

({
    baseUrl: ".",

    paths: {
        jquery: '../components/jquery/dist/jquery.min',
        'knockout': '../components/knockout/dist/knockout',
        'knockout.mapping': './knockout.mapping.2.4.1.min',
        'swiper': '../components/Swiper/dist/js/swiper.jquery.min',
        'ReceivedOrders': './received-orders'
    },
    name: "main-received",
    out: "../../dist/public/js/main-received.js"

})
