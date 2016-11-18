(function($) {

    Vue.directive('scrollable', {

        bind: function () {

            if ($.fn.perfectScrollbar) {
                Vue.nextTick(function() {
                    $(this.el).perfectScrollbar({
                        // axis: this.expression
                    });
                }.bind(this));
            }

        },
    });

})(jQuery);
