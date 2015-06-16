/**
 * Created by thram on 16/06/15.
 */
var Modal = (function () {
    function newApp(el, onClose) {
        var target = $(el.attr('href'));
        var _elements = {
            app_name: target.find("#app-name"),
            app_namespace: target.find("#app-namespace"),
            add_application_btn: target.find("#add-application")
        };

        _elements['app_name'].on('keyup', function () {
            _elements['app_namespace'].parent().find('i,label').addClass('active');
            _elements['app_namespace'].val($(this).val().replace(/[|&;$%@"#!<>()+,]/g, '').toLowerCase().replace(new RegExp(' ', 'g'), '_'));
        });
        _elements['add_application_btn'].on('click', function () {

            var app = {
                app_namespace: target.find('#app-namespace').val(),
                app_name: target.find('#app-name').val(),
                options: {
                    type: target.find('input[name="type"]:checked').val(),
                    error_probability: target.find('#error-probability').val()
                },
                defaults: {
                    response_time: target.find('#response-time').val(),
                    max_items_req: target.find('#max-items-req').val()
                }
            };
            new Application(app).save(onClose, function (err) {
                console.error(err)
            });
        });
    }

    return {
        newApp: newApp
    };
})();