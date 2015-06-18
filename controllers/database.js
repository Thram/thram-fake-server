/**
 * Created by thram on 14/06/15.
 */
var Datastore = require('nedb'),
    _ = require('lodash');
var database = (function () {
    var db = new Datastore({filename: 'db/server.db', autoload: true});
    db.ensureIndex({fieldName: 'app_namespace', unique: true}, function (err) {
    });

    function insert(data, success, error) {
        db.insert(data, function (err, docs) {
            // docs is an array containing documents Mars, Earth, Jupiter
            // If no document is found, docs is equal to []
            if (err) {
                if (error)
                    error({error: err});
                else
                    console.log(err);
            } else {
                success({result: docs});
            }
        });
    }

    function update(id, data, success, error) {
        return db.update({_id: id}, data, {}, function (err, numReplaced) {
            // numReplaced = 1
            // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
            // Note that the _id is kept unchanged, and the document has been replaced
            // (the 'system' and inhabited fields are not here anymore)
            if (err) {
                if (error)
                    error({error: err});
                else
                    console.log(err);
            } else {
                success({result: numReplaced});
            }
        });
    }

    function remove(id, success, error) {
        return db.remove({_id: id}, {}, function (err, numRemoved) {
            // numRemoved = 1
            if (err) {
                if (error)
                    error({error: err});
                else
                    console.log(err);
            } else {
                success({result: numRemoved});
            }
        });
    }

    function get(filter, success, error) {
        console.log(filter);
        return db.find(filter, function (err, docs) {
            // docs is an array containing documents Mars, Earth, Jupiter
            // If no document is found, docs is equal to []
            console.log(docs);
            console.log(err);
            if (err) {
                if (error)
                    error({error: err});
                else
                    console.log(err);
            } else {
                success({result: docs});
            }
        });
    }

    function getById(id, success, error) {
        return db.find({_id: id}, function (err, docs) {
            // docs is an array containing documents Mars, Earth, Jupiter
            // If no document is found, docs is equal to []
            if (err) {
                if (error)
                    error({error: err});
                else
                    console.log(err);
            } else {
                success({result: docs});
            }
        });
    }

    function list(success, error) {
        return db.find({}, function (err, docs) {
            // docs is an array containing documents Mars, Earth, Jupiter
            // If no document is found, docs is equal to []
            if (err) {
                if (error)
                    error({error: err});
                else
                    console.log(err);
            } else {
                success({result: docs});
            }
        });
    }

    return {
        list: list,
        get: get,
        getById: getById,
        insert: insert,
        update: update,
        remove: remove
    }
})();

module.exports = database;