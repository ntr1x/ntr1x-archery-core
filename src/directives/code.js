(function($) {

    Vue.directive('code', {

        inserted: function (el) {

            let textarea = $(el);

            console.log(textarea)

            let div = $('<div></div>', {
                // position: 'absolute',
                // width: textarea.width(),
                // height: textarea.height(),
                // 'class': textarea.attr('class')
            }).insertBefore(textarea);

            textarea.css({
                position: 'absolute',
                visibility: 'hidden',
                height: '0px',
            })

            let editor = ace.edit(div[0]);
            editor.renderer.setShowGutter(true)
            editor.setShowPrintMargin(false)
            editor.setFontSize(14)
            editor.setTheme("ace/theme/monokai")
            editor.setOptions({
                maxLines: 10000
            });
            editor.getSession().setValue(textarea.val());
            editor.getSession().setMode("ace/mode/velocity");
            editor.getSession().setUseSoftTabs(true);
            editor.getSession().setUseWrapMode(true);
            editor.getSession().setWrapLimitRange(110, 110);

            editor.getSession().on('change', function(){
                textarea.val(editor.getSession().getValue());
            })
            // editor.getSession().setMode("ace/mode/" + mode);
            // editor.setTheme("ace/theme/idle_fingers");

            // copy back to textarea on form submit...
            // textarea.closest('form').submit(function () {
            //     textarea.val(editor.getSession().getValue());
            // })
        },
    });

})(jQuery);
