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

            if ($(window).width() <= 420) return;

            var defaults = {
                //inputClass: '.livesearch',
                itemType: 'product',
                items: ['Kylin', 'Lanlan', 'Nancy', 'Caisong', 'Zoe', 'Sophia', 'Ruolan']

            };

            if (options) {
                settings = $.extend({}, defaults, options);
            } else {
                settings = $.extend({}, defaults, settings);
            }

            var olClass = `dropdown--${settings.itemType}s`;
            var liClass = `option--${settings.itemType}`;
            var searchClass = `livesearch--${settings.itemType}`;
            var isDropdownShow = false;

            $(document).bind('click', function(event) {

                var $target = $(document.activeElement);

                if (!$target.hasClass(searchClass)) {
                    $(`.${olClass}`).remove();
                }

            });



            function setDropdown($target, items) {

                if (Array.isArray(items) && items.length > 0) {

                    var offset = $target.offset();
                    var width = $target.outerWidth();



                    var olHtml = `<ol class="dropdown ${olClass}">`
                    items.forEach(function(item,index) {
                        if(index<15){
                            olHtml += `<li class="option ${liClass}">${item}</li>`;
                        }
                    });
                    olHtml += '</ol>';

                    var $ol = $(olHtml);

                    $ol.css('width', width);
                    $ol.offset({ left: offset.left, top: offset.top + 18 });

                    $ol.children('li').one('click', function() {

                        $target.val($(this).text());
                        $target.change()

                        $(`.${olClass}`).remove();

                        return false;

                    });

                    $('main').append($ol);

                    return true;

                } else {

                    return false;
                }
            }

            function filterItems(keywords) {
                keywords = keywords.toLowerCase();
                return settings.items.filter(item => item.toLowerCase().includes(keywords));
            }

            return this.each(function() {

                var $this = $(this);

                $this.bind('input', function() {

                    $(`.${olClass}`).remove();

                    var keywords = $this.val();
                    if (keywords != '') {

                        let items = filterItems(keywords);

                        isDropdownShow = setDropdown($this, items);
                    }

                    return false;
                });

                $this.bind('focus', function() {

                    var keywords = $this.val();

                    if (keywords != '') {
                        let items = filterItems(keywords);
                        isDropdownShow = setDropdown($this, items);
                    }

                    return false;

                });

                $this.on('keydown', function(event) {

                    var $target = $(document.activeElement)


                    if (isDropdownShow) {

                        $activeOption = $(`.${liClass}.isActive`);

                        if ($activeOption.length > 0) {

                            if (event.keyCode == 38) {

                                $prevOption = $activeOption.prev(`.${liClass}`);
                                if ($prevOption.length > 0) {
                                    $activeOption.removeClass('isActive');
                                    $prevOption.addClass('isActive');
                                }

                            } else if (event.keyCode == 40) {

                                $nextOption = $activeOption.next(`.${liClass}`);
                                if ($nextOption.length > 0) {
                                    $activeOption.removeClass('isActive');
                                    $nextOption.addClass('isActive');
                                }

                            } else if (event.keyCode == 13) {

                                $activeOption.click();
                                return false;

                            }

                        } else if (event.keyCode == 40) {
                            let $options = $(`.${liClass}`);

                            if ($options.length > 0) {

                                var $first = $options.first();
                                $first.addClass('isActive');

                            }

                        }

                    }


                });

                if (settings.trigger) {
                    $this.focus();
                }




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

    $.fn.dropdown.setOptions = function(items) {
        settings.items = items;

    }



})(jQuery);
