var AWS = require('aws-sdk');
var express = require('express');

var s3 = new AWS.S3();
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  buf = new Buffer(req.body.blob.replace(/^data:image\/\w+;base64,/, ""),'base64');

  var params = {
    Body: buf,
    Bucket: "peyote-personal-orders", 
    Key: req.body.key
  };

  s3.putObject(params, function(err, data) {
    if (err && err.status && err.status !== 200) {
      res.status(err.status).send('There was an error');
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
