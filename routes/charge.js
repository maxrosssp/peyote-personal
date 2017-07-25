var keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY;
var keySecret = process.env.STRIPE_SECRET_KEY_TEST;

var stripe = require('stripe')(keySecret);
var express = require('express');

var router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);

  stripe.charges.create({
    amount: Math.round(req.body.amount),
    description: "Sample Charge",
    currency: "usd",
    source: req.body.source
  }, function(err, charge) {
    console.log(err || charge);

    res.render('index', {title: 'PP'});
  });

});

module.exports = router;