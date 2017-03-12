(function($) {

    Vue.directive('scrollable', {

        bind: function (el) {

            if ($.fn.perfectScrollbar) {
                // Vue.nextTick(function() {
                //     $(el).perfectScrollbar({
                //         // axis: this.expression
                //     });
                // }.bind(this));
            }

        },
    });

})(jQuery);
