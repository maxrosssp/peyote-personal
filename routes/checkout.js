var express = require('express');

var keySecret = process.env.STRIPE_SECRET_KEY;
var stripe = require('stripe')(keySecret);

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var atob = require('atob');

var TemplateBuilder = require('./peyote-processor/templateBuilder');

var templatePrice = 20;
var pricePerSquareInch = 1.5;
var pricePerColor = 1;
var priceForClasps = 3;
var priceToShip = 5;
var salesTax = 0.06;
var areaFromImgWidth = {'119': 1.2 * 6.5, '111': 1.2 * 7, '103': 1.2 * 7.5, '97' : 1.2 * 8, '92' : 1.2 * 8.5, '86' : 1.2 * 9, '82' : 1.2 * 9.5,
  '134': 1.35 * 6.5, '125': 1.35 * 7, '116': 1.35 * 7.5,  '109': 1.35 * 8, '103': 1.35 * 8.5, '97' : 1.35 * 9, '92' : 1.35 * 9.5, '149': 1.5 * 6.5, '138': 1.5 * 7,
  '129': 1.5 * 7.5, '121': 1.5 * 8, '114': 1.5 * 8.5, '107': 1.5 * 9, '102': 1.5 * 9.5
};

function calculatePrice(width, specs) {
  var price = templatePrice;

  if (specs.includeBeads) {
    price += areaFromImgWidth[width] * pricePerSquareInch;
    if (specs.colorCount > 12) price += pricePerColor * (specs.colorCount - 12);
  }

  if (specs.includeClasps) price += priceForClasps;
  price += price * salesTax;
  if (specs.includeBeads || specs.includeClasps) price += priceToShip;

  return Math.round(price * 100);
};

function getPngDimensions(imgUri) {
  let dataView = new DataView(Uint8Array.from(atob(imgUri.split(',')[1].slice(0, 50)).slice(16,24), c => c.charCodeAt(0)).buffer);

  return {width: dataView.getInt32(0), height: dataView.getInt32(4)};
}

var router = express.Router();

var uploadedImageBuffer;
router.post('/', function(req, res, next) {
  uploadedImageBuffer = new Buffer(req.body.url.replace(/^data:image\/\w+;base64,/, ""),'base64');

  console.log('1');

  s3.putObject({
    Body: uploadedImageBuffer,
    Bucket: "peyote-personal-orders",
    Key: req.body.token.card.name + '-' + (new Date().toISOString().replace(/(-|:|\.)/g, '')) + '.jpg'
  }, function(err, data) {
    if (err) {
      console.log('2 bad');

      // res.status(500, 'Internal server error');
    } else {
      console.log('2 good');

      // next();
    }

    next();
  });
}, function(req, res, next) {
  var dimensions = getPngDimensions(req.body.url);

  console.log('3');

  stripe.charges.create({
    amount: calculatePrice(dimensions.width, req.body.specs),
    currency: "usd",
    source: req.body.token.id
  }, function(err, data) {
    if (err) {
      console.log('4 bad');

      // res.status(500, 'Internal server error');
    } else {
      console.log('4 good');

      // next();
    }

    next();
  });
}, function(req, res, next) {
  TemplateBuilder.build(uploadedImageBuffer, req.body.specs.colorCount, 3)
  .then(function(image) {
    console.log('6 good');

    console.log(image);

    image.write('./test/output/build_1.jpg');
  })
  .catch(function(err) {
    console.log('6 bad');

    console.log(err);
  });

  console.log('5');

  res.json({message: 'Success!'});
});



module.exports = router;
