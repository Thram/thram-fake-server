/**
 * Created by thram on 14/06/15.
 */
var App = (function () {

    function init() {
        $(".button-collapse").sideNav();
        $('.modal-trigger').leanModal();
        Dashboard.init();

        console.log('App Init :D')
    }

    return {init: init}

})();