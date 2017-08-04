/**
 * Express Setup
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')

var index = require('./routes/index');
var image = require('./routes/image');
var checkout = require('./routes/checkout');
var charge = require('./routes/charge');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/image', image);
app.use('/checkout', checkout);
app.use('/charge', charge);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

/**
 * AWS Setup
 */

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var s3 = new AWS.S3();

// Create a bucket and upload something into it
var bucketName = 'peyote-personal-orders';
var keyName = 'hello_world.txt';

/**
 * 
 */

module.exports = app;
