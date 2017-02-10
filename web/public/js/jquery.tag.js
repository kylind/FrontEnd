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
                inputClass: '.input-tag'

            };

            var settings = $.extend({}, defaults, options);

            return this.each(function() {

                var $this = $(this);




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





