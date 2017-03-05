(function(Vue, $) {

    Vue.component('texteditor', {
        template: '<div data-form="texteditor" style="opacity: 0"></div>',
        props: {
            value: String,
            mode: {
                type: String,
                default: 'ace/mode/html'
            },
            theme: {
                type: String,
                default: 'ace/theme/monokai'
            },
        },
        mounted: function() {

            let editor = this.editor = ace.edit(this.$el);

            editor.setValue(this.value || '', 1)
            editor.renderer.setShowGutter(true)
            editor.setShowPrintMargin(false)
            editor.setFontSize(14)
            editor.setTheme(this.theme)
            editor.setOptions({
                maxLines: 10000
            });

            editor.getSession().setMode(this.mode);
            editor.getSession().setUseSoftTabs(true);
            editor.getSession().setUseWrapMode(true);
            editor.getSession().setWrapLimitRange(80, 80);

            $(this.$el).css({ opacity: 1})

            // let heightUpdateFunction = () => {
            //     var newHeight = editor.getSession().getScreenLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();
            //     $(this.$el).height(newHeight.toString() + 'px');
            //
            //     // $('#editor-section').height(newHeight.toString() + "px");
            //     // This call is required for the editor to fix all of
            //     // its inner structure for adapting to a change in size
            //     editor.resize();
            //     console.log('resized')
            // };
            // // Set initial size to match initial content
            // heightUpdateFunction();

            editor.getSession().on('change', () => {
                this.$emit('input', editor.getSession().getValue())
                // heightUpdateFunction()
            })
        },
        beforeDestroy: function() {
            this.editor.destroy()
        }
    })

})(Vue, jQuery);
