var express = require('express');
var endpoint = require('../controllers/endpoint');
var application = require('../controllers/application');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('apps', {title: 'Dashboard'});
});

/* GET home page. */
router.get('/:app_name', function (req, res, next) {
    application.get(req.params.app_name, function (data) {
        res.render('app', {title: 'Page of ' + req.params.app_name, data: data});
    });

});

router.post('/:app_name', function (req, res, next) {
    var data = req.body;
    application.create(data, function (result) {
        console.log('- route/apps.js:POST:SUCCESS: ');
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log('- route/apps.js:POST:ERROR: ');
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

router.delete('/:app_name', function (req, res, next) {
    application.remove(req.params.app_name, function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

router.put('/:app_name', function (req, res, next) {
    var data = req.body;
    console.log(data);
    application.update(req.params.app_name, data['options'], function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

router.post('/:app_name/*', function (req, res) {
    var data = req.body;
    endpoint.create(req.params.app_name, req.params[0], data['schema'], data['options'], function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

router.put('/:app_name/*', function (req, res) {
    var data = req.body;
    endpoint.update(req.params.app_name, req.params[0], data['schema'], data['options'], function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

router.delete('/:app_name/*', function (req, res) {
    endpoint.delete(req.params.app_name, req.params[0], function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

router.get('/:app_name/*', function (req, res) {
    //var data = req.params[0].split('/');
    //var result = endpoint.process(data.shift(), data.shift(), data);
    var result = endpoint.process(req.params.app_name, req.params[0], function(){

    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
});

module.exports = router;
