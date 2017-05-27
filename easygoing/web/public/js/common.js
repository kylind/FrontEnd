define(['jquery', 'knockout', 'knockout.mapping', 'swiper', 'colorbox', 'tag','dropdown'], function($, ko, mapping, Swiper) {



    var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    }


    function initTapEvent(options) {

        var updateAllData = options.updateAllData;
        var updateCurrentData = options.updateCurrentData;
        var setViewModelStatus = options.setViewModelStatus;
        var swiper = options.swiper;

        ko.bindingHandlers.tap = {

            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

                var handler = valueAccessor();

                $(element).on('click', function(event) {

                    var $target = $(event.target);
                    var $submitting = $('.prompt-submitting');
                    var $succeed = $('.prompt-succeed');
                    var $confirm = $('.confirm');

                    if ($target.hasClass('action-delete') && $target.hasClass('action-submit')) {
                        var offset = $target.offset();

                        $('.confirm-submit').one('click', function() {

                            $confirm.fadeOut('slow');
                            handler(bindingContext.$data, bindingContext.$parent, event, function() {
                                $submitting.children('span').text(" 提交中...");
                                var offset = $target.offset();
                                $('.prompt').css('top', offset.top).show();

                            }, function(needRefreshRest) {

                                $submitting.addClass('disappeared')
                                $succeed.removeClass('disappeared')

                                $('.prompt').delay(600).fadeOut('slow', function() {
                                    $submitting.removeClass('disappeared')
                                    $succeed.addClass('disappeared')
                                });


                                if(setViewModelStatus){
                                    setViewModelStatus(swiper.activeIndex);
                                }

                                if (needRefreshRest && updateAllData) {
                                    updateAllData();
                                }

                            });

                        })

                        $('.confirm-cancel').one('click', function() {

                            $confirm.fadeOut('slow');

                        })

                        $('.confirm').css('top', offset.top).fadeIn('slow');


                    } else if ($target.hasClass('action-submit')) {

                        var activeElement = $(document.activeElement);

                        if (!activeElement.hasClass('action-submit')) {
                            activeElement.blur();
                        }

                        setTimeout(function() {

                            handler(bindingContext.$data, bindingContext.$parent, event, function() {
                                $submitting.children('span').text(" 提交中...");
                                var offset = $target.offset();
                                $('.prompt').css('top', offset.top).show();

                            }, function(needRefreshRest, needRefreshCurrent) {

                                if(setViewModelStatus){
                                    setViewModelStatus(swiper.activeIndex);
                                }



                                $submitting.addClass('disappeared');
                                $succeed.removeClass('disappeared');

                                $('.prompt').delay(1200).fadeOut('slow', function() {
                                    $submitting.removeClass('disappeared')
                                    $succeed.addClass('disappeared')

                                });

                                if (needRefreshCurrent && updateCurrentData) {
                                    updateCurrentData();
                                }

                                if (needRefreshRest && updateAllData) {
                                    updateAllData();
                                }

                            });

                        }, 100);

                    } else if ($target.hasClass('action-load')) {

                        handler(bindingContext.$data, bindingContext.$parent, event, function() {
                            $submitting.children('span').text(" 加载中...");
                            var offset = $target.offset();
                            $('.prompt').css('top', offset.top).show();

                        }, function() {

                            $('.prompt').delay(600).fadeOut('slow');

                            if(swiper){
                                swiper.update();
                            }


                        });

                    } else {
                        handler(bindingContext.$data, bindingContext.$parent, event);


                    }
                    return false;
                });


            },
            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

            }
        }
    }

    return {
        $: $,
        ko: ko,
        mapping: mapping,
        Swiper: Swiper,
        initTapEvent: initTapEvent
    }

});