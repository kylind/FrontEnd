requirejs.config({

    baseUrl: './components',

    paths: {
        jquery: './jquery/dist/jquery.min',
        'knockout': './knockout/dist/knockout',
        'knockout.mapping': '../js/knockout.mapping.2.4.1.min',
        'received-orders':'../js/received-orders'
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
                var $confirm = $('.confirm');

                if ($target.hasClass('action-delete') && $target.hasClass('action-submit')) {
                    var offset = $target.offset();

                    $('.confirm-submit').one('click', function() {

                        $confirm.fadeOut('slow');
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

                    })

                    $('.confirm-cancel').one('click', function() {

                        $confirm.fadeOut('slow');

                    })

                    $('.confirm').css('top', offset.top).fadeIn('slow');


                } else if ($target.hasClass('action-submit')) {

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

    $(document).on('keydown', function(event) {
        if (event.keyCode == 13) {
            //var $target = $(document.activeElement).closest('.enterArea').find('.action-enter');
            $(document.activeElement).blur();
            var $target = $('.action-enter');
            setTimeout(function() {
                $target.trigger('click')
            }, 100);
            return false;

        }


    });


    var ordersModel = new OrdersModel(orders);
    ko.applyBindings(ordersModel, $('#receivedOrders')[0]);


    $(window).scroll(function() {
        var top = $(window).scrollTop();
        $(".searchbox").css("top", top);

    });


});
