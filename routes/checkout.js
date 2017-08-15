var express = require('express');
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var AWS = require('aws-sdk');
var atob = require('atob');
var Jimp = require('jimp');
var TemplateBuilder = require('./peyote-processor/templateBuilder');

var s3 = new AWS.S3();
var router = express.Router();

var AWS_PEYOTE_ORDERS_BUCKET = 'peyote-personal-orders';

var disableShipping = true;
var templatePrice = 20;
var pricePerSquareInch = 1.5;
var pricePerColor = 1;
var priceForClasps = 3;
var priceToShip = 5;
var salesTax = 0.06;
var beadHeightToIn = {'93.5': 6.5, '100.5': 7, '107.5': 7.5, '114.5': 8, '121.5': 8.5, '129.5': 9, '136.5': 9.5};
var beadWidthToIn = {'24': 1.2, '27': 1.35, '30': 1.5};

var calculatePrice = function(specs) {
  var squareInches = beadWidthToIn[specs.beadWidth] * beadHeightToIn[specs.beadHeight];
  var price = templatePrice;

  if (!disableShipping && specs.includeBeads) {
    price += squareInches * pricePerSquareInch;

    if (specs.colorCount > 12) price += pricePerColor * (specs.colorCount - 12);
  }

  if (!disableShipping && specs.includeClasps) price += priceForClasps;

  price += price * salesTax;

  if (!disableShipping && (specs.includeBeads || specs.includeClasps)) price += priceToShip;

  return Math.round(price * 100);
};

var getPngDimensions = function(imgUri) {
  var dataView = new DataView(Uint8Array.from(atob(imgUri.split(',')[1].slice(0, 50)).slice(16,24), c => c.charCodeAt(0)).buffer);

  return {width: dataView.getInt32(0), height: dataView.getInt32(4)};
};

var uploadedImageBuffer;
var templateSaveName;
var orderId;
var colorMap;
var finalTemplateImageFileName;
var finalTemplateImageBuffer;

router.post('/', function(req, res, next) {
  uploadedImageBuffer = new Buffer(req.body.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  templateSaveName = req.body.token.card.name + '-' + (new Date().toISOString().replace(/(-|:|\.)/g, '')) + '.jpg';

  s3.putObject({
    Body: uploadedImageBuffer,
    Bucket: AWS_PEYOTE_ORDERS_BUCKET,
    Key: 'pending/' + templateSaveName
  }, function(err, data) {
    if (err) {
      console.log('2 bad');
      console.log(err);
      res.status(500).send(err);
    } else next();
  });
}, function(req, res, next) {
  stripe.charges.create({
    amount: calculatePrice(req.body.specs),
    currency: 'usd',
    source: req.body.token.id
  }, function(err, data) {
    if (err) {
      console.log(err);
      console.log('4 bad');
      res.status(err.statusCode).send(err);
    } else {
      orderId = data.id;
      next();
    }
  });
}, function(req, res, next) {
  TemplateBuilder.build(uploadedImageBuffer, req.body.specs, 3)
  .then(function(template) {
    template.image.getBase64(Jimp.AUTO, function(err, encodedImage) {
      if (err) {
        console.log('7 bad');
        throw new Error('Unable to encode image');
      }

      res.mailer.send('receiptEmail', {
        to: req.body.specs.email,
        subject: 'Your personalized peyote stitch template is ready!',
        attachments: [{
          fileName: 'Personalized_Template.' + template.image.getExtension(),
          contents: new Buffer(encodedImage.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        }],
        orderId: orderId,
        colorMap: template.colorMap
      }, function(err) {
        if (err) {
          console.log('8 bad');
          console.log(err);
        } else {
          console.log('Email sent!');
          next();
        }
      });
    });
  })
  .catch(function(err) {
    console.log('6 bad');
    console.log(err);
  });

  res.json({message: 'Success!', path: '/success'});
}, function(req, res, next) {
  s3.deleteObject({
    Bucket: AWS_PEYOTE_ORDERS_BUCKET,
    Key: 'pending/' + templateSaveName
  }, function(err, data) {
    if (err) {
      console.log('9 bad');
      console.log(err);
    }
  });
});

module.exports = router;
















