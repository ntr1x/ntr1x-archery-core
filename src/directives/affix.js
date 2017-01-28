(function($) {

    Vue.directive('affix', {

        inserted: function (el, binding) {

            if ($.fn.affix) {
                $(el).affix(binding.value);
            }
        },
        // update: function (newValue, oldValue) {
        // },
        // unbind: function () {
        // }
    });

})(jQuery);
