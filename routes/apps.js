var express = require('express');
var endpoint = require('../controllers/endpoint');
var application = require('../controllers/application');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('dashboard', {title: 'Dashboard'});
});

/* GET home page. */
router.get('/:app_namespace', function (req, res, next) {
    application.getByNamespace(req.params.app_namespace, function (data) {
        console.log(data.result);
        res.render('details', {title: req.params.app_namespace, data: data.result[0]});
    });
});

router.post('/:app_namespace', function (req, res, next) {
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

router.delete('/:app_namespace', function (req, res, next) {
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

router.put('/:app_namespace', function (req, res, next) {
    var data = req.body;
    console.log('update!');
    application.update(data.id, data.app, function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

router.all('/:app_namespace/*', function (req, res, next) {
    //var data = req.params[0].split('/');
    endpoint.process(req.params.app_namespace, req.params[0], req.method, function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });

});

module.exports = router;
