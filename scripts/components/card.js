/**
 * Created by thram on 15/06/15.
 */
var Card = function (app) {
    var _template = '#card-template';
    var card = $($(_template).html());

    function _onClick(ev) {
        ev.stopPropagation();
        var appData = app.get();
        appData['_id'] = app.getId();
        thram.storage.set('tfs:app', appData);
        thram.router.go('/' + app.get().app_namespace);
    }

    card.find('.card-title').text(app.get().app_name);
    card.find('.endpoints-amount').text(app.get().endpoints ? app.get().endpoints.length : 0);
    card.find('.services-amount').text(app.get().services ? app.get().services.length : 0);
    card.on('click', _onClick);

    return card;
};