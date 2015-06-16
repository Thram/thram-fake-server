/**
 * Created by thram on 16/06/15.
 */
var Application = function (data) {
    data = data || {};
    var _id = data['_id'];
    var _app = {
        app_namespace: data['app_namespace'],
        app_name: data['app_name'],
        options: {
            type: data['options'] && data['options']['type']
        },
        defaults: {
            response_time: data['defaults'] && data['defaults']['response_time'],
            max_items_req: data['defaults'] && data['defaults']['max_items_req']
        },
        endpoints: [],
        services: []
    };


    function get() {
        return _app;
    }

    function set(key, value) {
        _app[key] = value;
    }

    function save(success, error) {
        if (_id) {
            $.put(_app.app_namespace, _app, success, 'json').fail(error);
        } else {
            $.post(_app.app_namespace, _app, function (res) {
                // Do something with the request
                success(res.result);
            }, 'json').fail(error);
        }

    }

    function add(type, value, success, error) {
        switch (type) {
            case 'endpoint':
                _app.endpoints.push(new Endpoint(value));
                break;
            case 'service':
                _app.services.push(new Service(value));
                break;
        }

        save(success, error);
    }

    return {
        get: get,
        set: set,
        save: save,
        add: add
    }
};

Application.list = function (success, error) {
    $.getJSON('t/f/s/list_apps').success(success).error(error);
};