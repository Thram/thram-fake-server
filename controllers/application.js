/**
 * Created by thram on 14/06/15.
 */

var database = require('./database');
var application = (function () {

    function getByName(name, success, error) {
        return database.get({app_name: name}, success, error);
    }

    function getById(id, success, error) {
        return database.get({_id: id}, success, error);
    }

    function create(data, success, error) {
        return database.insert(data, success, error);
    }

    function update(id, data, success, error) {
        return database.update(id, data, success, error);
    }

    function remove(id, success, error) {
        return database.remove(id, success, error)
    }

    function list(success, error) {
        return database.list(success, error);
    }

    return {
        getById: getById,
        getByName: getByName,
        list: list,
        create: create,
        update: update,
        remove: remove
    }

})();

module.exports = application;