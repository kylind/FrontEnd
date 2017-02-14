(function($) {

    var isTouch = ('ontouchend' in document.documentElement) ? 'touchend' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };

    var settings={};

    var methods = {

        init: function(options) {

            var defaults = {
                inputClass: '.hidden-tag',
                tags: ['美之屋', 'BB', '韩美']

            };

            settings = $.extend({}, defaults, options);

            function getTags() {
                return settings.tags;
            }

            function addTag(newTag) {
                if (settings.tags.indexOf(newTag) >= 0);
                else
                    settings.tags.unshift(newTag);
            }

            $(document).bind('click', function(event) {

                var $target = $(event.target);

                if ($target.hasClass('tag-label')); //$target.hasClass('tag-input') ||
                else {
                    var $active = $('.tag.isActive');
                    if ($active.length > 0) {
                        var $input = $active.find('.tag-input');
                        var $label = $active.find('.tag-label');

                        var val =$input.val();

                        if (val == '') {
                            $active.addClass('isEmpty');
                        } else {
                            $active.addClass('isLabel');
                            addTag(val)
                        }

                        $active.prev('hidden-tag').val(val);
                        $label.text(val);


                        $active.removeClass('isActive');
                    }
                }

            });

            return this.each(function() {

                var $this = $(this);
                var tagVal = $this.val();

                var $tag = $(`<div class="tag"><span class="tag-label">${tagVal}</span><div class="tag-inputbox"><input class="tag-input" value="${tagVal}"></span></div></div>`);

                var $label = $tag.find('.tag-label')
                var $inputbox = $tag.find('.tag-inputbox')
                var $input = $tag.find('.tag-input');

                $label.bind('click', function() {


                    var $active = $('.tag.isActive');
                    if ($active.length > 0) {
                        var $activeInput = $active.find('.tag-input');
                        var $activeLabel = $active.find('.tag-label');

                        var val=$activeInput.val();

                        if (val == '') {
                            $active.addClass('isEmpty');
                        } else {
                            $active.addClass('isLabel');
                            addTag(val)
                        }

                        $active.prev('hidden-tag').val(val);
                        $activeLabel.text(val);
                        $active.removeClass('isActive');
                    }


                    $tag.removeClass('isLabel isEmpty');

                    $tag.addClass('isActive');

                    $input.focus();
                });

                $input.bind('focus', function() {

                    $('.ol-tags').remove();

                    var tags = getTags();

                    var olHtml = '<ol class="ol-tags">'
                    tags.forEach(function(item) {
                        olHtml += `<li>${item}</li>`;
                    });
                    olHtml += '</ol>';

                    var $ol = $(olHtml);

                    $ol.children('li').one('click', function() {
                        $input.val($(this).text());
                        $label.text($(this).text());
                        $this.val($(this).text());

                        $tag.removeClass('isActive');
                        $tag.addClass('isLabel');

                        $input.next('.ol-tags').remove();
                        $input.focus();
                        return false;

                    });

                    $(this).after($ol);

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

    $.fn.tag.list=settings.tags;



})(jQuery || avajQuery);


//$('.hidden-tag').tag();
