(function($, Vue, Core) {

    Core.UUID = {
        random: () => { return Math.random().toString(36).substr(2, 9) }
    }

    Core.Array = function(owner, name) {

        return {

            clear: function() {

                owner[name].splice(0, owner[name].length)
                return this
            },

            create: function(value) {

                owner[name].push(value)
                return this
            },

            insert: function(value, index) {

                owner[name].splice(index, 0, value)
                owner[name] = owner[name].slice()
                return this
            },

            update: function(value, index) {

                let item = owner[name][index]
                Object.assign(item, value)
                owner[name] = owner[name].slice()
                return this
            },

            remove: function(index) {

                owner[name].splice(index, 1)
                owner[name] = owner[name].slice()
                return this
            }
        }
    }

    Core.Collection = function(owner, name) {

        return {

            clear: function() {

                owner[name].splice(0, owner[name].length)
                return this
            },

            create: function(value) {

                owner[name].push(Object.assign({
                    uuid: Math.random().toString(36).substr(2, 9)
                }, value))
                return this
            },

            insert: function(value, index) {

                owner[name].splice(index, 0, {
                    ...value,
                    uuid: Math.random().toString(36).substr(2, 9)
                })

                owner[name] = owner[name].slice()
                return this
            },

            update: function(value) {

                let items = owner[name]
                for (let i = 0; i < items.length; i++) {
                    let item = items[i]
                    if (item.uuid == value.uuid) {
                        Object.assign(item, value, {
                            uuid: Core.UUID.random()
                        })
                        return;
                    }
                }

                owner[name] = owner[name].slice()
                return this
            },

            remove: function(value) {

                let items = owner[name];

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]
                    if (item.uuid == value.uuid) {
                        items.splice(i, 1)
                        return;
                    }
                }
                return this
            }
        }
    }

    Core.WidgetMixin = {

        props: {
            page: Object,
            stack: Object,
            setup: Object,
            bindings: Object,
            children: Array,
            editable: Boolean,
        },

        data:  function() {
            return {
                systemId: this.systemId,
            }
        },

        created: function() {

            this.randomId = this.$store.getters.palette.generateId('widget-');

            this.$watch('bindings.id', function(value) {

                if (value) {
                    this.systemId = value;
                } else {
                    this.systemId = this.randomId;
                }
            }, {
                immediate: true
            });
        },
    };

    Core.StackedMixin = {

        props: {
            // globals: Object,
            // settings: Object,
            page: Object,
            // data: Object,
            // storage: Object,
            editable: Boolean,
            children: Array,
        },

        data: function() {
            return {
                stackId: this.stackId,
            }
        },

        created: function() {
            this.stackId = this.$store.getters.palette.generateId('widget-');
        }
    };

    Core.RepeaterMixin = {

        props: {
            page: Object,
            editable: Boolean,
            children: Array,
        },

        data: function() {
            return {
                stackId: this.stackId,
            }
        },

        created: function() {
            this.stackId = this.$store.getters.palette.generateId('widget-');
        }
    };

})(jQuery, Vue, Core);
