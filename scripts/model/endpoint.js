/**
 * Created by thram on 16/06/15.
 */
var Endpoint = function (data) {
    var _endpoint = {
        url: data['url'],
        type: data['type'],
        response: data['response']
    };

    if (data['options']) _endpoint['options'] = data['options'];

    return _endpoint;
};