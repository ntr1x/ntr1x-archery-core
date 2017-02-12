(function(Vue, $) {

    Vue.component('fileupload', {
        template: '#fileupload',
        mounted: function() {
            $('input[type="file"].fileupload-control', this.$el)
                .on('change', (e) => {
                    this.$emit('input', e)
                })
            ;
        },
    })

})(Vue, jQuery);
