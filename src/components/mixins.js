(function($, Vue, Core) {

    Core.Collection = function(owner, name) {

        return {

            create: function(value) {

                owner[name].push(Object.assign({
                    uuid: Math.random().toString(36).substr(2, 9)
                }, value));
            },

            update: function(value) {

                let items = owner[name];
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (item.uuid == value.uuid) {
                        Object.assign(item, value);
                        return;
                    }
                }

                owner[name] = owner[name].slice();
            },

            remove: function(value) {

                let items = owner[name];

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (item.uuid == value.uuid) {
                        items.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }

    Core.WidgetMixin = {

        props: {
            page: Object,
            data: Object,
            storage: Object,
            stack: Object,
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
            globals: Object,
            settings: Object,
            page: Object,
            data: Object,
            storage: Object,
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
