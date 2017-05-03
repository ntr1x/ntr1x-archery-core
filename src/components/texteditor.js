(function(Vue, $) {

    Vue.component('texteditor', {
        template: '<div data-form="texteditor"></div>',
        props: {
            value: String,
            mode: {
                type: String,
                default: 'text/html'
            },
            theme: {
                type: String,
                default: 'default'
            }
        },
        mounted: function() {

            let editor = this.editor = CodeMirror(this.$el, {
                mode: this.mode,
                theme: this.theme,
                lineNumbers: true,
                // lineWrapping: true,
                foldGutter: true,
                autoCloseBrackets: true,
                autoCloseTags: true,
                height: 'auto',
                viewportMargin: Infinity,
                tabMode: 'indent',
                tabSize: 4,
                indentUnit: 4,
                matchBrackets: true,
                autoRefresh: true,
                value: this.value || '',
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
            })

            editor.on('change', () => {
                this.$emit('input', editor.getValue())
            })
        },
        beforeDestroy: function() {
            
        }
    })

})(Vue, jQuery);
