(function ($, window, pluginName, undefined) {

    var defaults = {

        drag: true,
        drop: true,
        vertical: true,

        containerSelector: 'ol, ul',
        itemSelector: 'li',
        excludeSelector: '',

        bodyClass: 'dragging',
        activeClass: 'active',
        draggedClass: 'dragged',
        verticalClass: 'vertical',
        horizontalClass: 'horizontal',
        placeholderClass: 'placeholder',

        placeholder: '<li class="placeholder"></li>',

        offset: 'offset', // or position

        onDragStart: function(context, event) {

            var size = {
                height: context.$item.outerHeight(),
                width: context.$item.outerWidth(),
            };

            context.$originalItem = context.$item;

            context.$item = context.$originalItem
                .clone()
                .addClass(context.sortable.options.draggedClass)
                .css({
                    position: 'fixed',
                    left: event.pageX - context.adjustment.left,
                    top: event.pageY - context.adjustment.top,
                    width: size.width,
                    height: size.height,
                })
                .appendTo(context.$parent)
            ;
        },

        onDrag: function(context, event) {

            context.$item.css({
                left: event.pageX - context.adjustment.left,
                top: event.pageY - context.adjustment.top,
            })
        },

        onDrop: function(context/*, event*/) {

            context.$item.remove();
            if (context.location) {

                context.$item = context.location.before
                    ? context.$item.insertBefore(context.location.$item)
                    : context.$item.insertAfter(context.location.$item)
                ;

                context.$item.css({
                    position: '',
                    left: '',
                    top: '',
                    width: '',
                    height: '',
                })
            }

        },
    };

    var context = null;
    var sortables = [];

    function Sortable($element, options) {

        this.$element = $element;
        this.options = $.extend({}, defaults, options);

        $element.on('mousedown.sortable', this.options.itemSelector, (e) => { this.handleStart(e); });

        this.draggable = null;

        sortables.push(this);
    }

    $(document).ready(function() {
        $(document)
            .on('mouseup.sortable', (e) => { context && context.sortable.handleEnd(e, context); })
            .on('mousemove.sortable', (e) => { context && context.sortable.handleDrag(e, context); })
        ;
    });

    Sortable.prototype = {

        dropLocation: function(e) {

            var $item;
            var sortable;

            if (context) {

                var display = context.$item.css('display');
                context.$item.css({ display: 'none', });

                for (let i = 0; i < sortables.length; i++) {
                    let s = sortables[i];
                    if (s.options.drop) {
                        let $result = $(document.elementFromPoint(e.pageX, e.pageY)).closest(s.options.itemSelector);
                        if ($result.length && $result.closest(s.$element).length) {
                            $item = $result;
                            sortable = s;
                            break;
                        }
                    }
                }

                context.$item.css({ display: display, });

            } else {

                for (let i = 0; i < sortables.length; i++) {
                    let s = sortables[i];
                    if (s.options.drop) {
                        let $result = $(document.elementFromPoint(e.pageX, e.pageY)).closest(s.options.itemSelector);
                        if ($result.length && $result.closest(s.$element).length) {
                            $item = $result;
                            sortable = s;
                            break;
                        }
                    }
                }
            }

            if (sortable && $item && $item.length) {

                var $container = $item.closest(sortable.options.containerSelector);

                var offset = $item.offset();
                var size = {
                    width: $item.outerWidth(),
                    height: $item.outerHeight(),
                };

                var orientation = this.options.vertical
                    ? $container.hasClass(sortable.options.horizontalClass) ? 'h' : 'v'
                    : $container.hasClass(sortable.options.verticalClass) ? 'v' : 'h'
                ;

                var before = (orientation == 'h')
                    ? e.pageX - offset.left < size.width / 2
                    : e.pageY - offset.top < size.height / 2
                ;

                return {
                    $item: $item,
                    $container: $container,
                    sortable: sortable,
                    before: before,
                };
            }

            return null;
        },

        handleStart: function(e) {

            if (this.options.excludeSelector && $(e.target).closest(this.options.excludeSelector).length) {
                // console.log('exclude');
                return true;
            }

            var excludeTags = ['TEXTAREA', 'INPUT', 'BUTTON', 'LABEL'];

            if (excludeTags.indexOf($(e.target).prop('tagName')) < 0) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                return true;
            }

            if (!context) {

                var $item = $(e.target).closest(this.options.itemSelector);
                // var $parent = $item.parent();

                var offset = this.options.offset == 'offset'
                    ? $item.offset()
                    : $item.position()
                ;

                let margin = {
                    // left: parseInt($item.css('marginLeft')),
                    left: parseInt($item.css('marginLeft')),
                    top: parseInt($item.css('marginTop')),
                }

                console.log(margin, this.options.offset)

                context = {
                    sortable: this,
                    index: $item.index(),
                    $container: $item.closest(this.options.containerSelector),
                    $parent: $item.parent(),
                    $item: $item,
                    $originalItem: $item,
                    $targetItem: null,
                    $targetContainer: null,
                    location: this.dropLocation(e),
                    adjustment: {
                        // left: 0,
                        // top: 0,
                        // left: 0,
                        left: e.clientX - offset.left,
                        top: e.clientY - offset.top,
                        // left: e.clientX - 2 * offset.left + size.width / 4,
                        // top: e.clientY - 2 * offset.top + size.height / 4,
                    },
                };

                // console.log(JSON.stringify(context.adjustment), JSON.stringify(offset));

                this.options.onDragStart(context, e, defaults.onDragStart);
            }
        },

        handleEnd: function(e) {

            if (context) {

                for (var i = 0; i < sortables.length; i++) {
                    var sortable = sortables[i];
                    $(sortable.options.containerSelector, sortable.$element).removeClass(sortable.options.activeClass);
                }

                if (context.$placeholder) {
                    context.$placeholder.remove();
                }

                context.location = this.dropLocation(e);
                if (context.location) {
                    context.location.sortable.options.onDrop(context, e, defaults.onDrop);
                } else {
                    context.$item.remove();
                }

                context = null;
            }
        },

        handleDrag: function(e) {

            if (context) {

                for (var i = 0; i < sortables.length; i++) {
                    var sortable = sortables[i];
                    $(this.options.containerSelector, sortable.$element).removeClass(this.options.activeClass);
                }

                if (context.$placeholder) {
                    context.$placeholder.remove();
                }

                context.location = this.dropLocation(e);
                if (context.location) {
                    context.location.$container.addClass(context.location.sortable.options.activeClass);
                    context.$placeholder = context.location.before
                        ? $(context.location.sortable.options.placeholder).insertBefore(context.location.$item)
                        : $(context.location.sortable.options.placeholder).insertAfter(context.location.$item)
                    ;
                }

                context.sortable.options.onDrag(context, e, defaults.onDrag);
            }
        },
    };

    var API = $.extend(Sortable.prototype, {

        enable: function() {
        },
        disable: function () {
        },
        destroy: function () {
        }
    });

    $.fn[pluginName] = function(methodOrOptions) {

        var args = Array.prototype.slice.call(arguments, 1);

        return this.map(function() {

            var $t = $(this),
                object = $t.data(pluginName)
            ;

            if (object && API[methodOrOptions]) {
                return API[methodOrOptions].apply(object, args) || this;
            } else if (!object && (methodOrOptions === undefined || typeof methodOrOptions === 'object')) {
                $t.data(pluginName, new Sortable($t, methodOrOptions));
            }

            return this;
        });
    };

})(jQuery, window, 'sortable');
