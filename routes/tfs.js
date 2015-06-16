/**
 * Created by thram on 15/06/15.
 */
var express = require('express');
var application = require('../controllers/application');
var router = express.Router();

/* GET home page. */
router.get('/list_apps', function (req, res, next) {
    application.list(function (result) {
        console.log('Success App');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    }, function (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        res.send(JSON.stringify(err));
    });
});

module.exports = router;
