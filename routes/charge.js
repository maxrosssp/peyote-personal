var keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY;
var keySecret = process.env.STRIPE_SECRET_KEY_TEST;

var stripe = require('stripe')(keySecret);
var express = require('express');

var router = express.Router();


var calculatePrice = function(specs) {
  var templatePrice = 20;
  var pricePerSquareInch = 1.5;
  var pricePerColor = 1;
  var priceForClasps = 3;
  var priceToShip = 5;
  var salesTax = 0.06;

  var heightOptions = [
    {beads: 93.5, inches: 6.5, description: '6.5 in.'},
    {beads: 100.5, inches: 7, description: '7 in.'},
    {beads: 107.5, inches: 7.5, description: '7.5 in.'},
    {beads: 114.5, inches: 8, description: '8 in.'},
    {beads: 121.5, inches: 8.5, description: '8.5 in.'},
    {beads: 129.5, inches: 9, description: '9 in.'},
    {beads: 136.5, inches: 9.5, description: '9.5 in.'}
  ];
  var widthOptions = [
    {beads: 24, inches: 1.2, description: 'Skinny (1.2 in.)'},
    {beads: 27, inches: 1.35, description: 'Normal (1.35 in.)'},
    {beads: 30, inches: 1.5, description: 'Wide (1.5 in.)'}
  ];

  var price = templatePrice;

  if (specs.includeBeads) {
    var selectedHeight = heightOptions.find(function(option) {
      return option.beads === specs.beadHeight;
    }) || {};
    var selectedWidth = widthOptions.find(function(option) {
      return option.beads === specs.beadWidth;
    }) || {};

    var sizeInches = selectedHeight.inches * selectedWidth.inches;
    price += pricePerSquareInch * sizeInches.value;
    price += pricePerColor * (specs.colorCount - 12);
  }

  if (specs.includeClasps) {
    price += priceForClasps;
  }

  return Math.round(price * 100);
};


router.post('/', (req, res) => {
  console.log(req.body);

  stripe.charges.create({
    amount: calculatePrice(req.body.specs),
    currency: "usd",
    source: req.body.token
  }, function(err, charge) {
    if (err && err.status && err.status !== 200) {
      res.status(err.status).send(err);
    }

    res.send(charge);
  });
});

module.exports = router;











