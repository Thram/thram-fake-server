/**
 * Created by thram on 15/06/15.
 */
var Card = function (app) {
    var _template = '#card-template';
    var card = $($(_template).html());

    function _closeActiveCard() {
        var opened = $('.grid-item-open').removeClass('grid-item-open');
        opened.find('.summary').fadeIn();
        opened.find('.details').fadeOut();
        opened.on('click', _onClick);
        opened.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
            opened.parent().masonry();
        });
    }

    function _openCard(el) {
        _closeActiveCard();
        el.addClass('grid-item-open');
        el.find('.summary').fadeOut();
        el.find('.details').fadeIn();
        el.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
            el.parent().masonry();
        });
    }

    function _onClose(ev) {
        ev.stopPropagation();
        _closeActiveCard();
    }

    function _onClick(ev) {
        ev.stopPropagation();
        thram.router.go('/' + app.get().app_namespace);
        //var $this = $(this);
        //_openCard($this);
        //var closeBtn = $this.find('.mdi-navigation-close');
        //$this.off('click', _onClick);
        //closeBtn.off('click', _onClose);
        //closeBtn.on('click', _onClose);
    }

    function _addEndpoint(endpoint) {
        app.add('endpoint', endpoint, function () {
            _addEndpointRow(endpoint);
        }, function () {
            console.error("Error");
        });

    }

    function _addEndpointRow(endpoint) {
        var row = $('<tr>');
        row.append($('<td>').text(endpoint.route));
        row.append($('<td>').text(endpoint.hits));
        row.append($('<td>').text(endpoint.response_type));
        row.append($('<td>'));
        card.find('#endpoints-table tbody').append(row);
    }

    function _addService() {

    }

    _.each(app.get().endpoints, function (endpoint) {
        _addEndpointRow(endpoint);
    });

    card.find('.card-title').text(app.get().app_name);
    card.find('.endpoints-amount').text(app.get().endpoints ? app.get().endpoints.length : 0);
    card.find('.services-amount').text(app.get().services ? app.get().services.length : 0);
    card.find('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    card.find('.modal-trigger').leanModal();
    card.find('.add-endpoint').on('click', function (ev) {
        ev.stopPropagation();
        Modal.endpoint($(this), _addEndpoint);
    });
    card.find('.add-service').on('click', function (ev) {
        ev.stopPropagation();
        Modal.service($(this), _addService);
    });
    card.on('click', _onClick);

    return card;
};