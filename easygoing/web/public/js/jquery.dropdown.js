(function($) {

    var isTouch = ('ontouchend' in document.documentElement) ? 'touchend' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };

    var newTags = [];
    var settings = {};
    var $activeInput;
    var $activeTag;

    var methods = {

        init: function(options) {

            var defaults = {
                inputClass: '.livesearch',
                itemType: 'product',
                items: [],
                getItems() {

                    return [];

                },


            };

            if (options) {
                settings = $.extend({}, defaults, options);
            } else {
                settings = $.extend({}, defaults, settings);
            }






            $(document).bind('click', function(event) {


                var $active = $('.tag.isActive');
                if ($active.length > 0) {
                    var $input = $active.find('.tag-input');
                    var $label = $active.find('.tag-label');
                    var itemName = $active.next('.hidden-item').val();

                    var val = $input.val();

                    if (val == '') {
                        $active.addClass('isEmpty');
                    } else {
                        $active.addClass('isLabel');
                        addTag(val)
                    }

                    var $hiddenTag = $active.prev('.hidden-tag');

                    var oldVal = $hiddenTag.val();

                    $hiddenTag.val(val);
                    $hiddenTag.change();

                    $label.text(val);
                    settings.updateTag(itemName, oldVal, val);

                    $('.ol-items').remove();

                    $active.removeClass('isActive');

                }

                $('.ol-items').remove();
                isListActive = false;


            });

            var isListActive = false;

            $(document).on('keydown', function(event) {

                var $target = $(document.activeElement)

                if ($target.hasClass('tag-input')) {


                    if (!isListActive) {

                        if (event.keyCode == 13) {
                            $(document).click();
                        } else if (event.keyCode == 40) {

                            var $items = $('.ol-items > li');

                            $nextInput = $target.closest('.orderitem').next('.orderitem').find('.tag-input');

                            if ($items.length > 0) {

                                var $first = $items.first();

                                $first.addClass('isActive');
                                isListActive = true;


                            }


                        }

                    } else {

                        $activeTag = $('.item--tag.isActive');

                        if (event.keyCode == 38) {
                            $prevTag = $activeTag.prev('.item--tag');

                            if ($prevTag.length > 0) {
                                $activeTag.removeClass('isActive');
                                $prevTag.addClass('isActive');
                            }


                        } else if (event.keyCode == 40) {

                            $nextTag = $activeTag.next('.item--tag');

                            if ($nextTag.length > 0) {
                                $activeTag.removeClass('isActive');
                                $nextTag.addClass('isActive');
                                $activeTag = $nextTag;
                            }


                        } else if (event.keyCode == 13) {
                            isListActive = false;
                            $activeTag.click();
                        }
                    }

                }


            });

            function setDropdown($target, items) {

                if (Array.isArray(items) && items.length > 0 && $(window).width() > 420) {

                    var offset = $target.offset();
                    var width = $target.outerWidth();

                    var olClass = `ol-${settings.itemType}s`;

                    var olHtml = `<ol class="${olClass}">`
                    items.forEach(function(item) {
                        olHtml += `<li class="item--${settings.itemType}">${item}</li>`;
                    });
                    olHtml += '</ol>';

                    var $ol = $(olHtml);

                    $ol.css('width', width);
                    $ol.offset({ left: offset.left, top: offset.top + 18 });

                    $ol.children('li').one('click', function() {

                        $target.val($(this).text());

                        $(`.${olClass}`).remove();

                        return false;

                    });

                    $('main').append($ol);
                }
            }

            return this.each(function() {

                var $this = $(this);


                $this.bind('change', function() {

                    $('.ol-items').remove();

                    var keywords = $this.val();

                    let items = filterItems(keywords);
                    setDropdown(items);


                    return false;
                });

                $this.bind('focus', function() {


                    $('.livesearch.isActive').removeClass('isActive');

                    $this.addClass('isActive');
z ,x az

                    if (keywords != '') {
                        let items = filterItems(keywords);
                        setDropdown(items);

                    }


                    return false;



                });


                $this.after($tag);


            });

        }
    };

    $.fn.dropdown = function() {

        var method = arguments[0];

        if (methods[method]) {
            method = methods[method];
            var methodArguments = Array.prototype.slice(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods['init'];
            methodArguments = arguments;
        } else {
            $.error('method is not existed');
        }

        method.apply(this, methodArguments);
    };





})(jQuery);
,qz,asq