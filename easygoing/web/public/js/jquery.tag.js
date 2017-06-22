(function($) {

    var isTouch = ('ontouchend' in document.documentElement) ? 'touchend' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };




    var methods = {

        init: function(options) {

            var defaults = {

            };

            let globalSettings = $.fn.tag.globalSettings;

            let settings = Object.assign({}, defaults, options);

            function getTags() {

                return globalSettings.tags;
            }


            function addTag(newTag) {
                if (globalSettings.tags.indexOf(newTag) >= 0);
                else {
                    globalSettings.tags.unshift(newTag);
                }
            }

            $(document).on('click', function(event) {

                var $previousInput = $('.tag-input.isActive');

                if ($previousInput.length > 0) {

                    var $previousLabel = $previousInput.prev('.tag-label');
                    var $previousItem = $previousInput.next('.hidden-item');

                    //let oldVal = $previousLabel.text();

                    let val = $previousInput.val();

                    let itemName = $previousItem.val();

                    //$previousLabel.text(val);
                    $previousLabel.addClass('isActive');

                    $previousInput.change();
                    $previousInput.removeClass('isActive');


                    if (!val) {
                        $previousLabel.addClass('isEmpty');
                    } else {
                        $previousLabel.removeClass('isEmpty');
                        addTag(val)
                    }

                    globalSettings.updateTag(itemName, null, val);
                }

                $('.ol-tags').remove();
                isListActive = false;

            });

            var isListActive = false;

            return this.each(function() {

                let $label = $(this);

                let $input = $label.next('.tag-input');

                $input.on('keydown', function(event) {

                    var $target = $(document.activeElement)

                    if ($target.hasClass('tag-input')) {


                        if (!isListActive) {

                            if (event.keyCode == 13) {
                                $(document).click();
                                return false;
                            } else if (event.keyCode == 40) {

                                let $tags = $('.ol-tags > li');

                                let $nextInput = $target.closest('.orderitem').next('.orderitem').find('.tag-input');

                                if ($tags.length > 0) {

                                    var $first = $tags.first();

                                    $first.addClass('isActive');
                                    isListActive = true;

                                }

                            }

                        } else {

                            let $activeTag = $('.item--tag.isActive');

                            if (event.keyCode == 38) {
                                let $prevTag = $activeTag.prev('.item--tag');

                                if ($prevTag.length > 0) {
                                    $activeTag.removeClass('isActive');
                                    $prevTag.addClass('isActive');
                                }


                            } else if (event.keyCode == 40) {

                                let $nextTag = $activeTag.next('.item--tag');

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

                $input.bind('click', function() {

                    return false;

                });

                $input.bind('focus', function() {

                    var offset = $input.offset();
                    var width = $input.outerWidth();

                    $('.ol-tags').remove();

                    var tags = getTags();

                    if (Array.isArray(tags) && tags.length > 0 && $(window).width() > 420) {
                        var olHtml = '<ol class="ol-tags">'
                        tags.forEach(function(item) {
                            olHtml += `<li class="item--tag">${item}</li>`;
                        });
                        olHtml += '</ol>';

                        var $ol = $(olHtml);

                        $ol.css('width', width);
                        $ol.offset({ left: offset.left, top: offset.top + 18 });

                        $ol.children('li').one('click', function() {
                            var val = $(this).text();

                            //var oldVal = $label.text();

                            $input.val(val);
                            $input.change();
                            $input.removeClass('isActive');

                            //$label.text(val);
                            $label.removeClass('isEmpty');
                            $label.addClass('isActive');

                            globalSettings.updateTag(settings.itemName, null, val);

                            $('.ol-tags').remove();

                            return false;

                        });

                        $('main').append($ol);
                    }

                    return false;

                });

                //$label.after($input);

                $label.bind('click', function() {

                    var $previousInput = $('.tag-input.isActive');

                    if ($previousInput.length > 0) {

                        var $previousLabel = $previousInput.prev('.tag-label');
                        var $previousItem = $previousInput.next('.hidden-item');


                        let itemName = $previousItem.val();
                        let val = $previousInput.val();

                        $previousInput.change();

                        $previousInput.removeClass('isActive');

                        //$previousLabel.text(val);
                        $previousLabel.addClass('isActive');

                        if (!val) {
                            $previousLabel.addClass('isEmpty');
                        } else {
                            $previousLabel.removeClass('isEmpty');
                            addTag(val)
                        }

                        globalSettings.updateTag(itemName, null, val);
                    }

                    $('.ol-tags').remove();
                    isListActive = false;


                    $label.removeClass('isActive');
                    $input.addClass('isActive');

                    $input.focus();
                    return false;
                });

                if (settings.trigger) {
                    $label.click();
                }

            });

        }
    };

    $.fn.tag = function() {

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

    $.fn.tag.setTags = function(_tags) {
        if (Array.isArray(_tags) && _tags.length > 0) {

            console.log($.fn.tag.globalSettings.tags);


            let tags = Array.from(new Set([..._tags, ...($.fn.tag.globalSettings.tags)]));

            $.fn.tag.globalSettings.tags = tags;

        }

    };

})($);
