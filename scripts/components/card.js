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
        var $this = $(this);
        _openCard($this);
        var closeBtn = $this.find('.mdi-navigation-close');
        $this.off('click', _onClick);
        closeBtn.off('click', _onClose);
        closeBtn.on('click', _onClose);
    }

    function _addEndpoint(endpoint) {
        app.add('endpoint', endpoint, function(){
            console.log("Success");
        }, function(){
            console.error("Error");
        });

    }

    function _addService() {

    }

    card.find('.card-title').text(app.get().app_name);
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