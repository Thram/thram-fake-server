/**
 * Created by thram on 14/06/15.
 */
var App = (function () {
    function init() {
        $(".button-collapse").sideNav();
        $('.modal-trigger').leanModal();
        $("#add-endpoint").on('click', function () {
            var url = $('#app-name').val() + '/' + $('#endpoint').val();
            $.post(url, {schema: $('#schema').val()}).success(function (res) {
                alert(JSON.stringify(res));
            });
        });

        console.log('App Init :D')
    }

    return {init: init}

})();