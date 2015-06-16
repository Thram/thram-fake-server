/**
 * Created by thram on 16/06/15.
 */
var Data = (function () {
    var _data = {};

    function get(key) {
        return _data[key];
    }

    function put(key, value) {
        _data[key] = value;
        return value;
    }
    function remove(key) {
        delete _data[key];
    }

    return {
        remove: remove,
        get: get,
        put: put
    }
})();