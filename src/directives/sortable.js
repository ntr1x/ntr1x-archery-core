(function($, Core) {

    Vue.directive('sortable', {

        bind: function () {

            var adjustment;

            console.log(this.el);

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

                    // console.log('item', $item);
                    // console.log('container', container);
                    // console.log('_super', _super);
                    // console.log('event', event);

                    var w = $item.data('widget');

                    if (w) {
                        // var ni = find(self.items, evt.newIndex);
                        var ni = find(self.items, $item.index());
                        self.items.splice(ni, 0, Vue.service('palette').widget(w));
                    }

                    // console.log('w', w);
                    // console.log('index', $item.index());

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
