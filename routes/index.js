var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Peyote Personal' });
});

router.get('/success', function(req, res, next) {
  res.render('checkoutComplete', {title: 'Success!'});
});

module.exports = router;
