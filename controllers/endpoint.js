/**
 * Created by thram on 14/06/15.
 */

var fakeData = require('./fake.data');
var application = require('./application');
var endpoint = (function () {

    function process(appName, endpointUrl, success, error) {
        application.getByName(appName, function(app){
            var endpointData = _.find(app['endpoint'], {url: endpointUrl});
            var result = fakeData.generateFromSchema(endpointData.schema, res.options['quantity']);
            success(result);
        }, error);

    }

    return {
        process: process
    }

})();

module.exports = endpoint;
