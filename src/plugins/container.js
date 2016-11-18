(function($, Vue) {

    Vue.use({

        install: function(Vue) {

            var services = {};

            Vue.service = function(name, service) {

                return services[name] = services[name] || service;
            }
        }
    });
})(jQuery, Vue);
