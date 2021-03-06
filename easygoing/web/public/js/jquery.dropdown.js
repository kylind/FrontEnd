(function($) {

    var isTouch = ('ontouchend' in document.documentElement) ? 'touchend' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };

    var newTags = [];

    var $activeInput;
    var $activeTag;

    var methods = {

        init: function(options) {

            if ($(window).width() <= 420) return;

            var defaults = {
                //inputClass: '.livesearch',
                //itemType: 'product',
                products: [],
                clients: [],
                productNames: [],
                sellComputing: true,
                buyComputing: true

            };



            var globalSettings = $.fn.dropdown.settings;

            // if (options) {
            //     settings = $.extend(defaults, globalSettings, options);
            // } else {
            //     settings = $.extend(defaults, globalSettings, {});
            // }

            let settings=Object.assign({},defaults,globalSettings,options);


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
                    items.forEach(function(item, index) {
                        if (index < 15) {
                            olHtml += `<li class="option ${liClass}">${item}</li>`;
                        }
                    });
                    olHtml += '</ol>';

                    var $ol = $(olHtml);

                    $ol.css('width', width);
                    $ol.offset({ left: offset.left, top: offset.top + 18 });

                    $ol.children('li').one('click', function() {

                        let chosenVal = $(this).text();
                        $target.val(chosenVal);

                        if (settings.afterChosen) {

                            let products = settings.products.length == 0 ? globalSettings.products : settings.products;

                            let product = products.find(product => product.name == chosenVal);


                            settings.afterChosen({
                                buyPrice: settings.buyComputing ? product.buyPrice : '',
                                sellPrice: settings.sellComputing ? product.sellPrice : ''

                            });

                        }



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

                let items = [];

                switch (settings.itemType) {

                    case 'product':

                        items = settings.productNames.length == 0 ? globalSettings.productNames : settings.productNames;
                        break;

                    case 'client':
                        items = settings.clients.length == 0 ? globalSettings.clients : settings.clients;
                        break;

                }

                return items.filter(item => item.toLowerCase().includes(keywords));

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

                    $(`.${olClass}`).remove();

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

                        var $activeOption = $(`.${liClass}.isActive`);

                        if ($activeOption.length > 0) {

                            if (event.keyCode == 38) {

                                let $prevOption = $activeOption.prev(`.${liClass}`);
                                if ($prevOption.length > 0) {
                                    $activeOption.removeClass('isActive');
                                    $prevOption.addClass('isActive');
                                }

                            } else if (event.keyCode == 40) {

                                let $nextOption = $activeOption.next(`.${liClass}`);
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

    $.fn.dropdown.settings = { products: [], clients: [], productNames: [], sellComputing: true, buyComputing: true }

})(jQuery);
