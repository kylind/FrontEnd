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
                inputClass: '.hidden-tag',
                tags: []

            };


            settings = $.extend({}, defaults, options);

            function getTags() {

                // var tags=Array.isArray($.fn.tag.list)?$.fn.tag.list:[];

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

                    $active.prev('hidden-tag').val(val);
                    $label.text(val);
                    settings.updateTag(itemName, val);

                    $('.ol-tags').remove();

                    $active.removeClass('isActive');
                    isListActive=false;
                }


            });

            var isListActive = false;

            $(document).on('keydown', function(event) {

                var $target = $(document.activeElement)

                if ($target.hasClass('tag-input')) {


                    if (!isListActive) {

                        if (event.keyCode == 13) {
                            $(document).click();
                        } else if (event.keyCode == 40) {

                            var $tags = $('.ol-tags > li');

                            $nextInput = $target.closest('.orderitem').next('.orderitem').find('.tag-input');

                            if ($tags.length > 0) {

                                var $first = $tags.first();

                                $first.addClass('isActive');
                                isListActive = true;


                            }

/*                            else if ($nextInput.length > 0) {
                                $nextInput.focus();
                                $activeInput = $nextInput;
                                isListActive = false;
                            }*/

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
                            isListActive=false;
                            $activeTag.click();
                        }
                    }

                }

                return false;

            });

            return this.each(function() {

                var $this = $(this);
                var tagVal = $this.val();

                var itemName = $this.next('.hidden-item').val();

                var $tag = $(`<span class="tag"><span class="tag-label">${tagVal}</span><input type="text" class="tag-input" value="${tagVal}"></span></span>`);

                var $label = $tag.find('.tag-label')

                var $input = $tag.find('.tag-input');

                $label.bind('click', function() {


                    var $active = $('.tag.isActive');
                    if ($active.length > 0) {
                        var $activeInput = $active.find('.tag-input');
                        var $activeLabel = $active.find('.tag-label');

                        var val = $activeInput.val();

                        if (val == '') {
                            $active.addClass('isEmpty');
                        } else {
                            $active.addClass('isLabel');
                            addTag(val)
                        }

                        $active.prev('hidden-tag').val(val);
                        $activeLabel.text(val);
                        $active.removeClass('isActive');
                        settings.updateTag(itemName, val);
                    }


                    $tag.removeClass('isLabel isEmpty');

                    $tag.addClass('isActive');

                    $input.focus();

                    return false;
                });

                $input.bind('focus', function() {

                    var offset = $input.offset();
                    var width = $input.outerWidth();

                    $activeInput = $input;

                    $('.ol-tags').remove();

                    var tags = getTags();

                    if (Array.isArray(tags) && tags.length > 0) {
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
                            $input.val(val);
                            $label.text(val);
                            $this.val(val);
                            settings.updateTag(itemName, val);

                            $tag.removeClass('isActive');
                            $tag.addClass('isLabel');



                            // $input.next('.ol-tags').remove();
                            $('.ol-tags').remove();
                            //$input.focus();
                            return false;

                        });

                        $('main').append($ol);
                    }

                    return false;



                });

                $input.bind('blur', function(event) {

                    /*                        var val = $(this).val();
                                            $label.val(val);
                                            $this.val(val);*/

                });


                $this.after($tag);

                if (tagVal != '') {
                    $tag.addClass('isLabel');
                } else {
                    $tag.addClass('isEmpty');
                }

            });

        }
    };

    $.fn.tag = function() {
        var method = arguments[0];

        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods['init'];
        } else {
            $.error('method is not existed');
        }

        method.apply(this, arguments);
    };

    $.fn.tag.setTags = function(tags) {
        if (Array.isArray(_tags) && tags.length > 0) {

            var tags = _tags.concat([]);

            newTags.forEach(function(item) {
                if (tags.indexOf(item) < 0) {
                    tags.unshift(item);
                }

            })

            settings.tags = tags;

        }

    };

    //  $.fn.tag.se=settings.tags;



})(jQuery);


//$('.hidden-tag').tag();
