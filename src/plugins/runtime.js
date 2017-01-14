(function($, Vue) {

    Vue.use({

        install: function(Vue) {

            let runtime = {

                evaluate: function(self, b, v) {

                    if (b && b.expression) {

                        try {
                            if (b.strategy == 'eval') {
                                return self.$eval(b.expression);
                            } else if (b.strategy == 'wire') {
                                return self.$get(b.expression);
                            } else {
                                return self.$interpolate(b.expression);
                            }
                        } catch (e) {
                            if (b.strategy == 'interpolate') {
                                console.log('Cannot evaluate expression', b.strategy, b.expression, self, e, e.stack);
                            }
                            return v;
                        }
                    }

                    return v;
                },

                evaluateParams: function(self, props, params, trace) {

                    if (trace) {
                        console.log(self);
                        console.log(props);
                        console.log(params);
                    }

                    let items = [];
                    if (props) {
                        for (let i = 0; i < props.length; i++) {
                            let prop = props[i];
                            let param = params && params[prop.name];
                            items.push({
                                prop: prop,
                                param: param,
                            });
                        }
                    }

                    let value = {};
                    for (let i = 0; i < items.length; i++) {

                        let item = items[i];

                        let n = item.prop.name;
                        let r = item.prop.variable;
                        // let t = item.prop.type;

                        let b = item.param ? item.param.binding : null;
                        let v = item.param ? item.param.value : null;
                        let p = (item.param && item.param.binding) ? item.param.binding.proto : null;

                        if (item.prop.type == 'asis') {

                            let res = runtime.evaluate(self, b, v);
                            let vv = r ? { value: res } : res;
                            value[n] = vv;

                        } else if (item.prop.type == 'object') {

                            if (b && b.expression) {

                                let vv = runtime.evaluate(self, b, v);
                                value[n] = vv;

                            } else {

                                let res = this.evaluateParams(self, item.prop.props, v);
                                let vv = r ? { value: res } : res;

                                value[n] = vv;
                            }
                        } else if (item.prop.type == 'action') {

                            let vv = runtime.evaluate(self, b, v);
                            value[n] = {
                                action: item.param.action,
                                payload: vv
                            }// vv || '';

                        } else if (item.prop.type == 'multiple') {

                            let vv;

                            if (b) {

                                let array = [];
                                let result = runtime.evaluate(self, b, v);
                                if (r) {
                                    vv = result;
                                } else {

                                    if (Array.isArray(result)) {

                                        for (let j = 0; j < result.length; j++) {

                                            let vm = new Vue({
                                                data: Object.assign(JSON.parse(JSON.stringify(self.$data)), {
                                                    item: result[j]
                                                })
                                            });

                                            array.push(this.evaluateParams(vm, item.prop.props, p));
                                        }

                                        vv = array;
                                    }
                                }

                            } else {

                                let array = [];

                                var index = 0;
                                if (Array.isArray(v)) {
                                    for(var j = 0; j < v.length; j++) {
                                        var vi = v[j];
                                        if (vi._action != 'remove') {
                                            array[index++] = this.evaluateParams(self, item.prop.props, vi);
                                        }
                                    }
                                }

                                vv = r ? { value: array } : array;
                            }

                            value[n] = vv;

                        } else {

                            let vv = runtime.evaluate(self, b, v);
                            value[n] = vv// || '';
                        }
                    }

                    return value;
                }
            };

            Vue.prototype.$runtime = runtime;
        }
    });
    
})(jQuery, Vue);
