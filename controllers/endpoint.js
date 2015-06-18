/**
 * Created by thram on 14/06/15.
 */
var _ = require('lodash');
var fakeData = require('./fake.data');
var application = require('./application');
var endpoint = (function () {

    function process(namespace, route, success, error) {
        application.getByNamespace(namespace, function (res) {
            var app = res.result[0];
            console.log(app);
            var endpointData = _.find(app['endpoints'], {route: route});
            console.log(endpointData);
            var result = {};
            try {
                result = fakeData.generateFromSchema(endpointData['options'].json_schema, app['defaults'].max_items_req);
            } catch (e) {
            }
            console.log(result);
            success(result);
        }, error);

    }

    return {
        process: process
    }

})();

module.exports = endpoint;
