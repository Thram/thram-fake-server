/**
 * Created by thram on 15/06/15.
 */
var Card = (function () {
    var _template = '#card-template';

    function _closeActiveCard() {
        var opened = $('.opened').removeClass('s12 m10 l8 opened').addClass('s6 m4 l2 closed');
        opened.find('.summary').fadeIn();
        opened.find('.details').fadeOut();
        //Data.remove('selected_app', opened.data('app'));
        setTimeout(function () {
            opened.on('click', _onClick);
        }, 0);
    }

    function _openCard(el) {
        _closeActiveCard();
        el.removeClass('s6 m4 l2 closed').addClass('s12 m10 l8 opened');
        el.find('.summary').fadeOut();
        el.find('.details').fadeIn();
        //Data.put('selected_app', el.data('app'));
    }

    function _onClose(ev) {
        ev.preventDefault();
        var $this = $(this);
        _closeActiveCard();
        $this.off('click', _onClose);
    }

    function _onClick(ev) {
        var $this = $(this);
        _openCard($this);
        $this.off('click', _onClick);
        $this.find('.mdi-navigation-close').on('click', _onClose);
    }

    function create(app) {
        var card = $($(_template).html());
        card.data('app', app);
        card.find('.card-title').text(app.get().app_name);
        card.find('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
        card.on('click', _onClick);
        return card;
    }

    return {
        create: create
    };
})();