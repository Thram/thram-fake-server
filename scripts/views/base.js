/**
 * Created by thram on 21/06/15.
 */
var Base = (function () {
    function init() {
        $(".button-collapse").sideNav();
        $('.modal-trigger').leanModal();
        $('select').material_select();
    }

    return {
        init: init
    }
})();