var express = require('express');
var endpoint = require('../controllers/endpoint');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('dashboard', {title: 'Dashboard'});
});

module.exports = router;
