/**
 * Created by thram on 17/06/15.
 */
var Dashboard = (function () {

    var _elements = {};

    function _addCard(data) {
        _elements['app_list'].append(Card.create(new Application(data)));
    }

    function init() {
        _elements['app_list'] = $('#apps-list');
        _elements['new_app_modal_btn'] = $('#new-app-modal-btn');
        Application.list(function (res) {
            _.each(res.result, function (data) {
                _addCard(data);
            });
            //Data.put('apps', apps);
        }, function (err) {
            console.log(err);
        });

        _elements['new_app_modal_btn'].on('click', function (ev) {
            Modal.newApp($(this), _addCard);
        });
    }

    return {
        init: init
    }
})();