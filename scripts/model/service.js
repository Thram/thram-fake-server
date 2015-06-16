/**
 * Created by thram on 16/06/15.
 */
var Service = function (data) {
    var _service = {
        url: data['url'],
        type: data['type'],
        response: data['response']
    };

    if (data['options']) _service['options'] = data['options'];

    return _service;
};