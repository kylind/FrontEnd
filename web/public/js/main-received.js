requirejs.config({

    basicUrl: './js',

    paths: {
        jquery: 'jquery-2.2.3.min',
        'knockout': 'knockout-3.4.0',
        'knockout.mapping': 'knockout.mapping.2.4.1'
    }

});



require(['received-orders', 'knockout', 'jquery'], function(OrdersModel, ko, $) {

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


    $(window).scroll(function() {
        var top = $(window).scrollTop();
       $(".searchbox").css("top",top);

    });


});
