(function(Vue, $, Core) {

    Core.TabsMixin = function(active) {

        return {

            data: function() {
                return {
                    tabs: {
                        active: active
                    }
                }
            },

            methods: {

                activate: function(tab) {
                    this.tabs.active = tab;
                },

                isActive: function(tab) {
                    return this.tabs.active == tab;
                }
            }
        }
    }

    Core.ActionMixin = function(ModalEditor) {

        return {

            props: {
                model: Object,
                globals: Object,
                context: Object,
            },

            methods: {

                open: function(context) {

                    var dialog = new ModalEditor({

                        data: {
                            globals: this.globals,
                            owner: this,
                            context: context || this.context,
                            original: this.model,
                            current: JSON.parse(JSON.stringify(this.model))
                        },

                        methods: {
                            submit: function() {
                                this.owner.doApply(this.current);
                                this.$el.remove();
                                this.$destroy();
                            },
                            reset: function() {
                                this.$el.remove();
                                this.$destroy();
                            }
                        }
                    }).$mount();

                    $(dialog.$el).appendTo($('body').get(0));

                    $('[data-auto-focus]', dialog.$el).focus();
                },

                doApply: function(model) {

                    Object.assign(this.model, JSON.parse(JSON.stringify(model)), {
                        _action: this.model._action
                            ? this.model._action
                            : 'update'
                    });

                    // this.model =
                    // Object.assign({}, JSON.parse(JSON.stringify(model)), {
                    //     _action: this.model._action
                    //         ? this.model._action
                    //         : 'update'
                    // });

                    this.$nextTick(() => {
                        $(window).trigger('resize');
                    });
                }
            }
        };
    };

    Core.EditorMixin = function(ListViewer, ModalEditor) {

        return {

            props: {
                items: Array,
                globals: Object
            },

            methods: {

                trigger: function(event, item, context) {
                    this.$dispatch(event, { item: item, context: context });
                },

                create: function(item, context) {

                    var dialog = new ModalEditor({

                        data: {
                            globals: this.globals,
                            owner: this,
                            context: context,
                            original: null,
                            current: item ? JSON.parse(JSON.stringify(item)) : {}
                        },

                        methods: {
                            submit: function() {
                                this.owner.doCreate(this.current);
                                this.$el.remove();
                                this.$destroy();
                            },
                            reset: function() {
                                this.$el.remove();
                                this.$destroy();
                            }
                        }
                    }).$mount();

                    $(dialog.$el).appendTo($('body').get(0));

                    $('[data-auto-focus]', dialog.$el).focus();
                },

                remove: function(item, context) {
                    this.doRemove(item, context);
                },

                update: function(item, context) {

                    this.active = item;

                    var dialog = new ModalEditor({

                        data: {
                            globals: this.globals,
                            owner: this,
                            context: context,
                            original: item,
                            current: JSON.parse(JSON.stringify(item))
                        },

                        methods: {
                            submit: function() {
                                this.owner.doUpdate(this.current);
                                this.$el.remove();
                                this.$destroy();
                            },
                            reset:  function() {
                                this.$el.remove();
                                this.$destroy();
                            },
                        }
                    }).$mount();

                    $(dialog.$el).appendTo($('body').get(0));

                    $('[data-auto-focus]', dialog.$el).focus();
                },

                doCreate: function(item) {

                    this.items.push(Object.assign({}, JSON.parse(JSON.stringify(item)), { _action: 'create' }));

                    this.items = this.items.slice();

                    $(window).trigger('resize');
                    this.active = null;
                },

                doUpdate: function(item) {

                    Object.assign(this.active, JSON.parse(JSON.stringify(item)), {
                        _action: this.active._action
                            ? this.active._action
                            : 'update'
                    });

                    // this.items = $.extend(true, [], this.items);//this.items.slice();
                    this.items = this.items.slice();
                    $(window).trigger('resize');
                    this.active = null;
                },

                doRemove: function(item) {

                    var index = this.items.indexOf(item);
                    if (index !== -1) {
                        if (item._action == 'create') {
                            this.items.splice(index, 1);
                        } else {
                            item2._action = 'remove';
                        }
                    }

                    // this.items = $.extend(true, [], this.items);
                    // this.$set('items', $.extend(true, [], this.items));
                    this.items = this.items.slice();

                    $(window).trigger('resize');
                    this.active = null;
                }
            },

            events: {
                create: function(data) { this.create(data.item, data.context); },
                update: function(data) { this.update(data.item, data.context); },
                remove: function(data) { this.remove(data.item, data.context); },
                doCreate: function(data) { this.doCreate(data.item, data.context); },
                doUpdate: function(data) { this.doUpdate(data.item, data.context); },
                doRemove: function(data) { this.doRemove(data.item, data.context); },
            }
        };
    };

    Core.ListViewerMixin = {

        props: {
            items: Array,
            globals: Object
        },

        methods: {
            trigger: function(event, item, context) { this.$dispatch(event, { item: item, context: context }); },
            create: function(item, context) { this.$dispatch('create', { item: item, context: context} ); },
            update: function(item, context) { this.$dispatch('update', { item: item, context: context} ); },
            remove: function(item, context) { this.$dispatch('remove', { item: item, context: context} ); },
        }
    };

    Core.ModalEditorMixin = {

        mounted: function() {

            $(this.$el).modal('show');
            $(this.$el).on('hide.bs.modal', (e) => {
                e.stopPropagation();
                this.reset();
            });
        },

        destroyed: function() {
            this.$nextTick(() => {
                $(this.$el).modal('hide');
            })
        },

        methods: {
            submit: function() {},
            reset: function() {}
        }
    };

})(Vue, jQuery, Core);
