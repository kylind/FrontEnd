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
                inputClass: '.hidden-tag',
                tags: ['美之屋', 'BB', '韩美']

            };

            var settings = $.extend({}, defaults, options);

            function getTags() {
                return settings.tags;
            }

            $(document).bind('click', function(event) {




                // $('.ol-tags').each(function() {

                //     if ($(this).prev('.tag-input').hasClass('isActive'));

                //     else {
                //         $(this).remove();

                //     }



                // });

                var $target = $(event.target);

                if ($target.hasClass('tag-input') || $target.hasClass('tag-label') || $target.hasClass('ol-option'));
                else {
                    var $active = $('.tag.isActive');
                    var $input = $active.find('.tag-input');

                    if ($input.val() == '') {
                        $('.tag').addClass('.isEmpty');

                    } else {
                        $('.tag').addClass('.isLabel');
                    }

                    $active.removeClass('isActive');
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
                    $tag.removeClass('isLabel');
                    $tag.removeClass('isEmpty');

                    $('.tag').removeClass('isActive');
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

                        if ($input.val() != '') {

                            //$inputbox.hide();

                            //$label.show();
                            $tag.removeClass('isActive');
                            $tag.addClass('isLabel');
                        }

                        $input.next('.ol-tags').remove();

                    });
                    $(this).after($ol);




                });

                $input.bind('blur', function(event) {

                    if ($(this).hasClass('isActive')) {


                    } else {


                    }

                    $(this).removeClass('isActive');


                });


                $this.after($tag);

                if (tagVal != '') {

                    //$label.show();
                    $tag.addClass('isLabel');

                } else {
                    //$inputbox.show();
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
    }


})(jQuery || avajQuery);


$('.hidden-tag').tag();
