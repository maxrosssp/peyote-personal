var express = require('express');

var router = express.Router();

var configVariables = {
  stripePubKey: process.env.STRIPE_PUBLISHABLE_KEY
};

router.get('/', function(req, res, next) {
  res.json(configVariables);
});

module.exports = router;
