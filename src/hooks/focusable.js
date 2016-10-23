(function($) {

    $.extend($.expr[':'], {
        focusable: function(el, index, selector){
            return $(el).is('a, button, :input, [tabindex]');
        }
    });

})(jQuery);
