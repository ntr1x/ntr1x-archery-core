(function($, Core) {

    Vue.directive('sortable', {

        bind: function () {

            var adjustment;

            this.sortable = $(this.el).sortable({
                group: 'widgets',
                containerSelector: '.wg-table',
                // containerPath: '> .wg-row',
                itemSelector: '.wg-row',
                // itemPath:
                placeholder: `
                    <div class="wg wg-row wg-row-placeholder">
                        <div class="wg wg-cell">
                            <div class="wg wg-inner"></div>
                        </div>
                    </div>
                `,
                isValidTarget: function ($item, container) {
                    return true;
                },
                // onDragStart: function ($item, container, _super) {
                //
                //     // Duplicate items of the no drop area
                //
                //     console.log(container.options);
                //     if(!container.options.drop) {
                //         $item.clone().insertAfter($item);
                //     }
                //
                //     _super($item, container);
                // },
                // onDrag: function($item, position, _super, event) {
                //     // console.log('onDrag', $item, position, _super, event);
                // },
                onDragStart: function ($item, container, _super) {

                    if(!container.options.drop) {
                        $item.clone().insertAfter($item);
                    }

                    var offset = $item.offset();
                    var pointer = container.rootGroup.pointer;

                    adjustment = {
                        left: pointer.left - offset.left,
                        top: pointer.top - offset.top,
                    };

                    _super($item, container);
                },
                onDrag: function ($item, position) {
                    $item.css({
                        left: position.left - adjustment.left,
                        top: position.top - adjustment.top,
                    });
                },
                onDrop: function ($item, container, _super, event) {
                    $item.removeClass(container.group.options.draggedClass).removeAttr("style");
                    $("body").removeClass(container.group.options.bodyClass);

                    // _super($item, container);
                },
            });

            // console.log(this.sortable);
        },
        update: function (newValue, oldValue) {
        },
        unbind: function () {
        }
    });

})(jQuery, Core);
