/**
 * Created by thram on 16/06/15.
 */
var Endpoint = function (data) {
    var _endpoint = {
        route: data['route'],
        method: data['method'],
        response_type: data['response_type']
    };

    if (data['options']) _endpoint['options'] = data['options'];

    return _endpoint;
};