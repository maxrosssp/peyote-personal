'use strict';

angular.module('app').factory('CropImageService', [CropImageService]);

function CropImageService($scope) {
  var slope = function(line) {
    var x1 = line[0][0];
    var y1 = line[0][1];
    var x2 = line[1][0];
    var y2 = line[1][1];

    if (x1 == x2) return false;
    return (y1 - y2) / (x1 - x2);
  };

  var yInt = function(line) {
    var x1 = line[0][0];
    var y1 = line[0][1];
    var x2 = line[1][0];
    var y2 = line[1][1];

    if (x1 === x2) return y1 === 0 ? 0 : false;
    if (y1 === y2) return y1;
    return y1 - slope([[x1, y1], [x2, y2]]) * x1;
  };

  var getXInt = function(line) {
    var x1 = line[0][0];
    var y1 = line[0][1];
    var x2 = line[1][0];
    var y2 = line[1][1];

    var slope;
    if (y1 === y2) return x1 == 0 ? 0 : false;
    if (x1 === x2) return x1;
    return (-1 * ((slope = slope([[x1, y1], [x2, y2]])) * x1 - y1)) / slope;
  };

  var getIntersection = function(line1, line2) {
    var x11 = line1[0][0];
    var y11 = line1[0][1];
    var x12 = line1[1][0];
    var y12 = line1[1][1];
    var x21 = line2[0][0];
    var y21 = line2[0][1];
    var x22 = line2[1][0];
    var y22 = line2[1][1];

    var slope1, slope2, yint1, yint2, intx, inty;
    if (x11 == x21 && y11 == y21) return [x11, y11];
    if (x12 == x22 && y12 == y22) return [x12, y22];

    slope1 = slope([[x11, y11], [x12, y12]]);
    slope2 = slope([[x21, y21], [x22, y22]]);
    if (slope1 === slope2) return false;

    yint1 = yInt([[x11, y11], [x12, y12]]);
    yint2 = yInt([[x21, y21], [x22, y22]]);
    if (yint1 === yint2) return yint1 === false ? false : [0, yint1];

    if (slope1 === false) return [y21, slope2 * y21 + yint2];
    if (slope2 === false) return [y11, slope1 * y11 + yint1];
    intx = (slope1 * x11 + yint1 - yint2)/ slope2;
    return [intx, slope1 * intx + yint1];
  };

  var toRadians = function(angle) {
    return angle * (Math.PI / 180);
  };

  var getImageLines = function(imageData, canvasData) {
    var rotateRad = toRadians(imageData.rotate);
    var sinR = Math.sin(rotateRad);
    var cosR = Math.cos(rotateRad);

    var canvas = {
      left: imageData.left,
      top: imageData.top,
      height: imageData.height,
      width: imageData.width
    };

    var image = {
      left: imageData.left,
      top: imageData.top,
      height: imageData.naturalHeight,
      width: imageData.naturalWidth
    };

    var points = [
      [canvas.left + (image.height * sinR), canvas.top],
      [canvas.left, image.height * cosR],
      [canvas.left + (image.width * cosR), canvas.height],
      [canvas.left + canvas.width, image.width * sinR]
    ];

    return [
      [points[0], points[1]],
      [points[1], points[2]],
      [points[2], points[3]],
      [points[3], points[0]]
    ];
  };

  var getCropLines = function(cropData) {
    return [
      [[cropData.left, 0], [cropData.left, cropData.height]],
      [[cropData.left + cropData.width, cropData.height], [cropData.left + cropData.width, 0]]
    ];
  };

  var getCropLineIntersection = function(imageLine, cropLine, side) {
    var index = {
      'left': {pos: 0, neg: 1},
      'right': {pos: 1, neg: 0}
    };
    var intersection = getIntersection(imageLine, cropLine);

    return getIntersection(imageLine, cropLine) || (slope(imageLine) > 0 ? cropLine[index[side].pos] : cropLine[index[side].neg]);
  };

  var getImageLineIntersection = function(imageLines, cropLine, side) {
    return imageLines.map(function(imageLine) {
      return getCropLineIntersection(imageLine, cropLine, side);
    });
  };

  var getImageCropIntersections = function(imageLines, cropLines) {
    var leftIntersects = getImageLineIntersection(imageLines.slice(0, 2), cropLines[0], 'left');
    var leftHeight = leftIntersects[1][1] - leftIntersects[0][1]

    var rightIntersects = getImageLineIntersection(imageLines.slice(2, 4), cropLines[1], 'right');
    var rightHeight = rightIntersects[1][1] - rightIntersects[0][1]

    return Math.max(leftHeight, rightHeight);
  };

  var calculateZoomRatio = function(cropData, imageData, canvasData) {
    var imageLines = getImageLines(imageData, canvasData);
    var cropLines = getCropLines(cropData);

    return getImageCropIntersections(imageLines, cropLines);
  };

  var distanceToColor = function(color) {
    return function(c1) {
      Math.sqrt(Math.pow(color[0] - c1[0], 2) + Math.pow(color[1] - c1[1], 2) + Math.pow(color[2] - c1[2], 2));
    };
  };

  var bestColorOption = function(palette, matchColor) {
    palette = angular.copy(palette);

    if (palette === null || palette.length < 1) {
      return '#fff0ff';
    }

    if (!matchColor) {
      return palette[0];
    }

    var distFunc = distanceToColor(matchColor);
    palette.sort(function(c1, c2) {
      return distFunc(c1) - distFunc(c2);
    });

    return palette[0];
  };

  var componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  var rgbToHex = function(rgb) {
      return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
  };

  return {
    getIntersection: getIntersection,
    getImageLines: getImageLines,
    getCropLines: getCropLines,
    getImageCropIntersections: getImageCropIntersections,
    calculateZoomRatio: calculateZoomRatio,
    bestColorOption: bestColorOption,
    rgbToHex: rgbToHex
  };
}