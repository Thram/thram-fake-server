/**
 * Created by thram on 17/06/15.
 */
var Dashboard = (function () {

    var _elements = {};

    function _addCard(data) {
        var card = new Card(new Application(data));
        _elements['apps_grid'].append(card).masonry('appended', card);
    }

    function init(url, params) {
        _elements['apps_grid'] = $('#apps-grid');
        _elements['new_app_modal_btn'] = $('#new-app-modal-btn');
        thram.models.get('application').list(function (res) {
            _elements['apps_grid'].masonry({
                // set itemSelector so .grid-sizer is not used in layout
                //itemSelector: '.grid-item',
                // use element for option
                isFitWidth: true,
                columnWidth: 200,
                percentPosition: true
            });
            _.each(_.sortBy(res.result, 'app_name'), function (data) {
                _addCard(data);
            });
            _elements['apps_grid'].masonry();

        }, function (err) {
            console.log(err);
        });

        _elements['new_app_modal_btn'].on('click', function (ev) {
            Modal.app($(this), _addCard);
        });
    }

    return {
        init: init
    }
})();