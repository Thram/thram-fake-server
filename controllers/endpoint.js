/**
 * Created by thram on 14/06/15.
 */

var database = require('./database');
var fakeData = require('./fake.data');
var endpoint = (function () {


    function get(appName, endpointUrl, success, error) {
        return database.getEndpoint(appName, endpointUrl, success, error);
    }

    function list(appName, success, error) {
        return database.listEndpoints(appName, success, error);
    }

    function create(appName, endpointUrl, schema, options, success, error) {
        return database.insertEndpoint(appName, endpointUrl, schema, options, success, error);
    }

    function update(appName, endpointUrl, schema, options, success, error) {
        return database.updateEndpoint(appName, endpointUrl, schema, options, success, error)
    }

    function remove(appName, endpointUrl, success, error) {
        return database.removeEndpoint(appName, endpointUrl, success, error)
    }

    function process(appName, endpointUrl, success, error) {
        get(appName, endpointUrl, function (res) {
            var result = fakeData.generateFromSchema(res.schema, res.options['quantity']);
            success({result: result});
        }, error);


    }

    return {
        get: get,
        list: list,
        create: create,
        process: process,
        update: update,
        remove: remove
    }

})();

module.exports = endpoint;
