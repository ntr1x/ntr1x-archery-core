(function($) {

    $.extend($.expr[':'], {
        focusable: function(el) {
            return $(el).is('a, button, :input, [tabindex]');
        }
    });

})(jQuery);
