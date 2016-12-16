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
            },
        }
    }

    Core.ActionMixin = function(ModalEditor) {

        return {

            props: {
                owner: Object,
                property: String,
                context: Object,
            },

            methods: {

                open: function() {

                    this.$store.commit('modals/show', {
                        name: ModalEditor,
                        context: this.context,
                        original: this.owner[this.property],
                        events: {
                            submit: (current) => { this.$store.commit('designer/property/update', { parent: this.owner, value: current, property: this.property }) },
                        }
                    })
                },
            }
        };
    };

    Core.ActionApplyMixin = function(ModalEditor) {

        return {

            props: {
                model: Object,
            },

            methods: {

                open: function() {

                    this.$store.commit('modals/show', {
                        name: ModalEditor,
                        context: { type: 'update' },
                        original: this.model,
                        events: {
                            submit: (current) => { this.$store.commit('designer/params/update', { model: this.model, value: current }) },
                        }
                    })
                },
            }
        };
    };

    Core.EditorMixin = function(ModalEditor) {

        return {

            props: {
                owner: Object,
                property: String,
            },

            methods: {

                remove: function(item) {

                    this.$store.commit('designer/items/remove', { parent: this.owner, item: item, property: this.property })
                },

                create: function(item) {

                    this.$store.commit('modals/show', {
                        name: ModalEditor,
                        context: { type: 'create' },
                        original: item,
                        events: {
                            submit: (current) => { this.$store.commit('designer/items/create', { parent: this.owner, item: current, property: this.property }) },
                        }
                    })
                },

                update: function(item) {

                    this.$store.commit('modals/show', {
                        name: ModalEditor,
                        context: { type: 'update' },
                        original: item,
                        events: {
                            submit: (current) => { this.$store.commit('designer/items/update', { parent: this.owner, item: current, property: this.property }) },
                        }
                    })
                },
            },
        };
    };

    Core.ListViewerMixin = {

        props: {
            owner: Object,
            property: String,
        },

        computed: {
            items: function() { return this.owner[this.property]; }
        },

        methods: {
            create: function(item, context) { this.$parent.create(item, context); },
            update: function(item, context) { this.$parent.update(item, context); },
            remove: function(item, context) { this.$parent.remove(item, context); },
        }
    };

    Core.ModalEditorMixin = {

        props: {
            original: Object,
            context: Object,
            events: Object,
        },

        created: function() {
            this.current = JSON.parse(JSON.stringify(this.original));
        },

        data: function() {
            return {
                current: this.current
            }
        },

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
            submit: function() {
                this.events && this.events.submit && this.events.submit(this.current);
                this.$destroy();
            },
            reset: function() {
                this.events && this.events.reset && this.events.reset(this.current);
                this.$destroy();
            }
        }
    };

})(Vue, jQuery, Core);
