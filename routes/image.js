var express = require('express');
var http = require('http');

var router = express.Router();

var getFileTypeFromBuffer = function (buf) {
  if (!(buf && buf.length > 1)) return null;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return {ext: 'jpg', mime: 'image/jpeg'};
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return {ext: 'png', mime: 'image/png'};
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return {ext: 'gif', mime: 'image/gif'};
  if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return {ext: 'webp', mime: 'image/webp'};
  if (buf[0] === 0x46 && buf[1] === 0x4C && buf[2] === 0x49 && buf[3] === 0x46) return {ext: 'flif', mime: 'image/flif'};
  // needs to be before `tif` check
  if (((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0) || (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A)) && buf[8] === 0x43 && buf[9] === 0x52) return {ext: 'cr2', mime: 'image/x-canon-cr2'};
  if ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0) || (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A)) return {ext: 'tif', mime: 'image/tiff'};
  if (buf[0] === 0x42 && buf[1] === 0x4D) return {ext: 'bmp', mime: 'image/bmp'};
  if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0xBC) return {ext: 'jxr', mime: 'image/vnd.ms-photo'};
  if (buf[0] === 0x38 && buf[1] === 0x42 && buf[2] === 0x50 && buf[3] === 0x53) return {ext: 'psd', mime: 'image/vnd.adobe.photoshop'};
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) return {ext: 'ico', mime: 'image/x-icon'};

  return null;
};

var getUrlParts = function(url) {
  var splitUrl = url.split('/').slice(url.indexOf("://") > -1 ? 2 : 0);

  return {
    hostname: splitUrl[0].split(':')[0].split('?')[0],
    path: '/' + splitUrl.slice(1).join('/')
  };
};

router.post('/download', function(req, res, next) {
  var urlParts = getUrlParts(req.body.imageUrl);
  
  var request = http.get({
    hostname: urlParts.hostname,
    path: urlParts.path
  }, function(response) {
    var data = '';

    console.log(urlParts.hostname + ':' + response.statusCode);
    response.setEncoding('base64');

    response.on('data', function (chunk) {
      data += chunk;
    });

    response.on('end', function() {
      var imageBuffer = Buffer.from(data, 'base64');
      var fileType = getFileTypeFromBuffer(imageBuffer);

      if (!fileType) {
        res.status(402).send('Invalid file type');
      } else {
        res.set({
          'Content-Type': 'text/plain',
          'Content-Length': imageBuffer.length
        });

        res.send('data:' + fileType.mime + ';base64,' + imageBuffer.toString('base64'));
      }
    });
  });

  request.on('error', function(err) {
    res.status(402).send('Invalid url');
  });

  request.end();
});

module.exports = router;
