(function($) {

    Vue.directive('rich', {

        inserted: function (el, binding) {


            if (window.CKEDITOR) {

                let editor = window.CKEDITOR.inline(el, {
                    stylesSet: [
                        { name: 'Bolder', element: 'span', attributes: { 'class': 'extrabold'} }
                    ],
                    toolbarGroups: [
                        // { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
                        // { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
                        { name: 'links' },
                        // { name: 'forms' },
                        {name: 'tools'},
                        {name: 'document', groups: ['mode', 'document', 'doctools']},
                        {name: 'others'},
                        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
                        {name: 'colors'},
                        '/',
                        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                        {name: 'styles'},
                        '/',
                        { name: 'insert', groups: [ 'ImageButton' ]  }
                        //{name: 'about'}
                    ]
                });

                editor.on('change', () => {
                    editor.updateElement();
                    console.log('CHANGE IT!!!', binding.expression, binding);
                    binding.value.value = $(el).val();
                    // this.vm.$set(binding.expression, $(el).val());
                });

                editor.setData(binding.value.value);

                $(el).data('editor', editor);
            }
        },

        unbind: function (el) {
            let editor = $(el).data('editor');
            editor.destroy();
            $(el).data('editor', null);
        }
    });

})(jQuery);
