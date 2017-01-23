(function(Vue) {

    Vue.component('texteditor', {
        template: '<div data-form="texteditor"></div>',
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

            editor.getSession().setMode('ace/mode/velocity');
            editor.getSession().setUseSoftTabs(true);
            editor.getSession().setUseWrapMode(true);
            editor.getSession().setWrapLimitRange(110, 110);

            editor.getSession().on('change', () => {
                this.$emit('input', editor.getSession().getValue())
            })
        }
    })

})(Vue);
