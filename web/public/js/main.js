requirejs.config({

    basicUrl: './js',

    paths: {
        jquery: 'jquery-2.2.3.min',
        'knockout': 'knockout-3.4.0',
        'knockout.mapping': 'knockout.mapping.2.4.1',
        'swiper': 'swiper.jquery.min'

    },
    shim: {
        'swiper': ['jquery']
    }

});



require(['received-orders', 'knockout', 'jquery', 'swiper'], function(OrdersModel, ko, $, Swiper) {

    var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };

    ko.bindingHandlers.tap = {

        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

            var handler = valueAccessor();

            $(element).on('click', function(event) {

                $target = $(event.target);
                var $submitting = $('.prompt-submitting');
                var $succeed = $('.prompt-succeed');

                if ($target.hasClass('action-submit')) {

                    handler(bindingContext.$data, bindingContext.$parent, event, function() {
                        $submitting.children('span').text("Submitting...");
                        var offset = $target.offset();
                        $('.prompt').css('top', offset.top).show();

                    }, function() {

                        $submitting.addClass('disappeared')
                        $succeed.removeClass('disappeared')

                        $('.prompt').delay(600).fadeOut('slow', function() {
                            $submitting.removeClass('disappeared')
                            $succeed.addClass('disappeared')
                        });

                    });

                } else if ($target.hasClass('action-load')) {

                    handler(bindingContext.$data, bindingContext.$parent, event, function() {
                        $submitting.children('span').text("Loading...");
                        var offset = $target.offset();
                        $('.prompt').css('top', offset.top).show();

                    }, function() {

                        $('.prompt').delay(600).fadeOut('slow');

                    });

                } else {
                    handler(bindingContext.$data, bindingContext.$parent, event);


                }
                return false;
            });


        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        }
    };




    var ordersModel = new OrdersModel(orders);
    ko.applyBindings(ordersModel, $('#receivedOrders')[0]);

    var swiper = new Swiper('.swiper-container', {
        autoHeight: true,
        spaceBetween: 30,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        paginationBulletRender: function(index, className) {
            var bulletName = '';
            switch (index) {
                case 0:

                    bulletName = 'RECEIVEING';
                    break;

                case 1:
                    bulletName = 'PURCHASE';
                    break;

                case 2:
                    bulletName = 'RECKONING';
                    break;

                case 3:
                    bulletName = 'DELIVERY';
                    break;
            }
            return '<span class="' + className + '">' + bulletName + '</span>';
        }

    });

    ordersModel.setSwiper(swiper);


    require(['purchase-items', 'reckoning-orders', 'addresses', 'knockout', 'jquery'], function(ItemsModel, OrdersModel, AddressesModel, ko, $) {

        var itemsModel, reckoningOrdersModel, addressesModel;

        $.getJSON('./purchaseItemsJson', function(items, status) {
            itemsModel = new ItemsModel(items, swiper);
            ko.applyBindings(itemsModel, $('#purchaseItems')[0]);

        });

        $.getJSON('./reckoningOrdersJson', function(orders, status) {
            reckoningOrdersModel = new OrdersModel(orders, swiper);
            ko.applyBindings(reckoningOrdersModel, $('#reckoningOrders')[0]);

        });

        $.getJSON('./addressesJson', function(addresses, status) {
            addressesModel = new AddressesModel(addresses, swiper);
            ko.applyBindings(addressesModel, $('#addresses')[0]);

        });


        swiper.params.onSlideChangeStart = function(swiper) {

            switch (swiper.activeIndex) {
                case 0:
                    $.getJSON('./receivedOrdersJson', function(orders, status) {

                        ordersModel.setOrders(orders);
                        swiper.update();

                    });
                    break;
                case 1:
                    $.getJSON('./purchaseItemsJson', function(items, status) {
                        itemsModel.setItems(items);
                        swiper.update();

                    });
                    break;
                case 2:
                    $.getJSON('./reckoningOrdersJson', function(orders, status) {

                        var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                        reckoningOrdersModel.orders(observableOrders);
                        swiper.update();

                    })
                    break;
                case 3:
                    $.getJSON('./addressesJson', function(addresses, status) {
                        addressesModel.setAddresses(addresses);
                        swiper.update();

                    })
                    break;
            }


        }


    });


});
