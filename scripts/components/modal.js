/**
 * Created by thram on 16/06/15.
 */
var Modal = (function () {
    function endpoint(el, onClose) {
        var target = $(el.attr('href'));
        var _elements = {
            route: target.find("#route"),
            json_schema: target.find(".json-schema"),
            json_preview: target.find("#json-preview"),
            json_type: target.find("input[name=json-type]"),
            response_type: target.find("#response-type"),
            add_endpoint_btn: target.find("#add-endpoint")
        };
        _elements['add_endpoint_btn'].on('click', function () {
            var _endpoint = {
                route: _elements['route'].val(),
                response_type: _elements['response_type'].val()
            };
            var _options = {};
            switch (_endpoint['response_type']) {
                case 'json':
                default:
                    _options['json_schema'] = _elements['json_preview'].data('json')
            }
            _options['is_list'] = _elements['json_type'].find(':checked').val() === 'list';
            _endpoint['options'] = _options;
            onClose(_endpoint);
        });
        _elements['response_type'].val('json');
        target.find('.row.response-type.json').slideDown();
        _elements['response_type'].on('change', function () {
            target.find('.row.response-type:visible').slideUp();
            target.find('.row.response-type.' + $(this).val()).slideDown();
        });
        _elements['json_schema'].textcomplete([{
            match: /(^|\s)(\w{2,})$/,
            search: function (term, callback) {
                var words = ['google', 'facebook', 'github', 'microsoft', 'yahoo'];
                callback($.map(words, function (word) {
                    return word.indexOf(term) === 0 ? word : null;
                }));
            },
            replace: function (word) {
                return word + ' ';
            }
        }]);

        _elements['json_schema'].on('keyup', function () {
            try {
                var json = JSON.parse($(this).val().trim());
                _elements['json_preview'].html(_syntaxHighlight(JSON.stringify(json, null, 4)));
                _elements['json_preview'].data('json', json);
            } catch (e) {
            }
        });

    }

    function service(el, onClose) {
        var target = $(el.attr('href'));
        var _elements = {
            add_service_btn: target.find("#add-service")
        };
        _elements['add_service_btn'].on('click', onClose);

    }

    function app(el, onClose) {
        var target = $(el.attr('href'));
        var _elements = {
            app_name: target.find("#app-name"),
            app_namespace: target.find("#app-namespace"),
            type: target.find('input[name="type"]'),
            error_probability: target.find('#error-probability'),
            response_time: target.find('#response-time'),
            max_items_req: target.find('#max-items-req'),
            add_application_btn: target.find("#add-application")
        };

        _elements['app_name'].on('keyup', function () {
            _elements['app_namespace'].parent().find('i,label').addClass('active');
            _elements['app_namespace'].val($(this).val().replace(/[|&;$%@"#!<>()+,]/g, '').toLowerCase().replace(new RegExp(' ', 'g'), '_'));
        });
        _elements['add_application_btn'].on('click', function () {

            var app = {
                app_namespace: _elements['app_namespace'].val(),
                app_name: _elements['app_name'].val(),
                options: {
                    type: _elements['type'].find(':checked').val(),
                    error_probability: _elements['error_probability'].val()
                },
                defaults: {
                    response_time: _elements['response_time'].val(),
                    max_items_req: _elements['max_items_req'].val()
                }
            };
            new Application(app).save(onClose, function (err) {
                console.error(err)
            });
        });
    }

    return {
        app: app,
        endpoint: endpoint,
        service: service
    };
})();