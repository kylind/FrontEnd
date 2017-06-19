(function($) {

    var isTouch = ('ontouchend' in document.documentElement) ? 'touchend' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };

    var newTags = [];
    var settings = {};

    var $activeTag;

    var methods = {

        init: function(options) {

            var defaults = {
                inputClass: '.hidden-tag',
                tags: []

            };


            if (options) {
                settings = $.extend({}, defaults, options);
            } else {
                settings = $.extend({}, defaults, settings);
            }


            function getTags() {

                return settings.tags;
            }


            function addTag(newTag) {
                if (settings.tags.indexOf(newTag) >= 0);
                else {
                    settings.tags.unshift(newTag);
                    newTags.unshift(newTag);
                }
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

                    $active.removeClass('isActive');

                }

                $('.ol-tags').remove();
                isListActive = false;


            });

            var isListActive = false;



            return this.each(function() {

                let $label = $(this);

                $label.addClass('isActive');

                let tagVal = $label.text();
                if(!tagVal){
                    $label.addClass('isEmpty');
                }

                let $input = $(`<input type="text" class="tag-input" value="${tagVal}">`);

                $this.after($tag);

                $label.bind('click', function() {











                    $label.removeClass('isActive');
                    $input.addClass('isActive');




                    $input.focus();
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


                            var oldVal = $input.val();

                            $input.val(val);
                            $label.text(val);

                            $input.change();

                            settings.updateTag(settings.itemName, oldVal, val);

                            $input.removeClass('isActive');
                            $label.addClass('isActive');

                            $('.ol-tags').remove();

                            return false;

                        });

                        $('main').append($ol);
                    }

                    return false;

                });


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

            var tags = _tags.concat([]);

            newTags.forEach(function(item) {
                if (tags.indexOf(item) < 0) {
                    tags.unshift(item);
                }

            })

            settings.tags = tags;

        }

    };

    $.fn.tag.settings = settings;



})(jQuery);
