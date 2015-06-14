/**
 * Created by thram on 14/06/15.
 */
var Datastore = require('nedb'),
    _ = require('lodash');
var database = (function () {
    var db = new Datastore({filename: '../db/server.db', autoload: true});
    db.ensureIndex({fieldName: 'app', unique: true}, function (err) {
    });

    function insertApp(appName, options, success, error) {
        var app = {
            app: appName,
            options: options,
            endpoints: []
        };

        db.insert(app, function (err, docs) {
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

    function insertEndpoint(appName, endpoint, schema, options, success, error) {
        var endpointObj = {
            endpoint: endpoint,
            schema: schema,
            options: options
        };
        return db.find({app: appName}, function (err, docs) {
            var app = docs[0];
            app.endpoints.push(endpointObj);
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

    function updateApp(appName, data, success, error) {
        // Replace a document by another
        return db.update({app: appName}, data, {}, function (err, numReplaced) {
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

    function updateEndpoint(appName, endpoint, schema, options, success, error) {
        // Replace a document by another
        return db.find({app: appName}, function (err, docs) {
            var app = docs[0];
            var currentEndpoint = _.find(app.endpoints, function (e) {
                return e.endpoint == endpoint;
            });
            app.endpoints[app.endpoints.indexOf(currentEndpoint)] = {
                endpoint: endpoint,
                schema: schema,
                options: options
            };
            return updateApp(appName, app, success, error);
        });
    }

    function removeEndpoint(appName, endpoint, success, error) {
        return db.find({app: appName}, function (err, docs) {
            var app = docs[0];
            var currentEndpoint = _.find(app.endpoints, function (e) {
                return e.endpoint == endpoint;
            });
            app.endpoints.splice(app.endpoints.indexOf(currentEndpoint), 1);
            return updateApp(appName, app, success, error);
        });
    }

    function removeApp(appName, success, error) {
        return db.remove({app: appName}, {}, function (err, numRemoved) {
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

    function getEndpoint(appName, endpoint, success, error) {
        return db.find({app: appName}, function (err, docs) {
            // docs is an array containing documents Mars, Earth, Jupiter
            // If no document is found, docs is equal to []
            var app = docs[0];
            var currentEndpoint = _.find(app.endpoints, function (e) {
                return e.endpoint == endpoint;
            });
            if (err) {
                if (error)
                    error({error: err});
                else
                    console.log(err);
            } else {
                success({result: currentEndpoint});
            }
        });
    }

    function getApp(appName, success, error) {
        return db.find({app: appName}, function (err, docs) {
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
        insertApp: insertApp,
        insertEndpoint: insertEndpoint,
        updateApp: updateApp,
        updateEndpoint: updateEndpoint,
        removeApp: removeApp,
        removeEndpoint: removeEndpoint,
        getApp: getApp,
        getEndpoint: getEndpoint
    }
})();

module.exports = database;