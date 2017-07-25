var AWS = require('aws-sdk');
var express = require('express');

var s3 = new AWS.S3();
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
