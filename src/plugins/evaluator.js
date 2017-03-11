(function($, Vue) {

    Vue.use({

        install: function(Vue) {

            Vue.prototype.$get = function(path, context, alternate) {

                let ctx = typeof context != 'undefined'
                    ? context
                    : this
                ;
                return _.get(ctx, path, alternate);
            }

            Vue.prototype.$eval = function(expression, context, alternate) {

                let ctx = typeof context != 'undefined'
                    ? context
                    : this
                ;

                try {

                    let keys = [];
                    let values = [];

                    if (ctx != null) {
                        for (let k in ctx) {
                            keys.push(k);
                            values.push(ctx[k]);
                        }
                    }

                    let f = new Function(keys.join(','), `return ${expression}`);
                    let value = f.apply(this, values);
                    return value;

                } catch (e) {

                    console.log(this)
                    this.$store.commit('console/log', {
                        group: 'runtime',
                        type: 'warning',
                        message: `Cannot evaluate expression: "${expression}". Default value used.`,
                        trace: (console) => {
                            console.groupCollapsed(e.message);
                            console.warn('Expression:', expression);
                            console.warn('Context:', ctx);
                            console.warn('Default:', alternate);
                            console.warn(e.stack);
                            console.groupEnd();
                        }
                    })

                    return alternate;
                }
            }

            Vue.prototype.$interpolate = function(template, context, alternate) {

                let ctx = typeof context != 'undefined'
                    ? context
                    : this
                ;

                try {

                    let compiled = _.template(template, {
                        interpolate: /{{([\s\S]+?)}}/g
                    })

                    return compiled(ctx)

                } catch (e) {

                    console.log(this)
                    this.$store.commit('console/log', {
                        group: 'runtime',
                        type: 'warning',
                        message: `Cannot interpolate template: "${template}". Default value used.`,
                        trace: (console) => {
                            console.groupCollapsed(e.message);
                            console.warn('Template:', template);
                            console.warn('Context:', ctx);
                            console.warn('Default:', alternate);
                            console.warn(e.stack);
                            console.groupEnd();
                        }
                    })

                    return alternate;
                }
            }
        }
    });

})(jQuery, Vue);
