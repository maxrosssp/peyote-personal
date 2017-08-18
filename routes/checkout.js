var express = require('express');
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);
var AWS = require('aws-sdk');
var atob = require('atob');
var Jimp = require('jimp');
var TemplateBuilder = require('./peyote-processor/templateBuilder');

AWS.config.update({region: 'us-east-1'});

var s3 = new AWS.S3();
var sqs = new AWS.SQS();

var router = express.Router();

var AWS_PEYOTE_ORDERS_BUCKET = 'peyote-personal-orders';
var AWS_SQS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/590514978494/awseb-e-gx27axszp7-stack-AWSEBWorkerQueue-FJDU6C7D9HZC';

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
  sqs.sendMessage({
    QueueUrl: AWS_SQS_QUEUE_URL,
    DelaySeconds: 0,
    MessageAttributes: {
      'imagePath': {
        DataType: 'String',
        StringValue: 'pending/' + templateSaveName
      },
      'colorCount': {
        DataType: 'Number',
        StringValue: req.body.specs.colorCount.toString()
      },
      'beadWidth': {
        DataType: 'Number',
        StringValue: req.body.specs.beadWidth.toString()
      },
      'beadHeight': {
        DataType: 'Number',
        StringValue: req.body.specs.beadHeight.toString()
      },
      'beadsPerColumnGroup': {
        DataType: 'Number',
        StringValue: '3'
      },
      'emailTo': {
        DataType: 'String',
        StringValue: req.body.specs.email
      },
      'orderId': {
        DataType: 'String',
        StringValue: orderId
      }
    },
    MessageBody: 'Personal Peyote Order: ' + orderId
  }, function(err, data) {
    if (err) console.log(err, err.stack);
    else next();          
  });
}, function(req, res, next) {
  res.json({message: 'Success!', path: '/success'});
});

module.exports = router;
















