/**
 * Created by thram on 14/06/15.
 */
var _ = require('lodash');
var fakeData = require('./fake.data');
var application = require('./application');
var endpoint = (function () {

    function process(namespace, route, method, success, error) {
        try {
            application.getByNamespace(namespace, function (res) {
                var app = res.result[0];
                var endpointData = _.find(app['endpoints'], {route: route});
                var result = {};
                var quantity = endpointData['options'].is_list === 'true' ? app['defaults'].max_items_req : 1;
                try {
                    result = fakeData.generateFromSchema(endpointData['options'].json_schema, quantity);
                } catch (e) {
                }
                success(result);
            }, error);
        } catch (e) {
            console.error('Endpoint not found: ' + route)
        }


    }

    return {
        process: process
    }

})();

module.exports = endpoint;
