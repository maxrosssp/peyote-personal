'use strict';

angular.module('app').factory('CropImageService', [
  '$q', CropImageService
]);

function CropImageService($q) {
  var getResizeData = function(containerData, canvasData, imageData, cropBoxAspectRatio) {
    var cropBox = {
      width: containerData.height * cropBoxAspectRatio,
      height: containerData.height,
      top: 0
    };
    cropBox.left = (containerData.width - cropBox.width) / 2;

    var image;
    if (canvasData.width < cropBox.width) {
      image = {
        width: cropBox.width,
        height: cropBox.width / imageData.aspectRatio
      };
    }

    if (cropBox.left < canvasData.left) {
      image = angular.extend({}, image, {left: cropBox.left});
    } else if ((cropBox.left + cropBox.width) > (canvasData.left + canvasData.width)) {
      image = angular.extend({}, image, {left: canvasData.left + ((cropBox.left + cropBox.width) - (canvasData.left + canvasData.width))});
    }

    return {
      image: image,
      cropBox: cropBox
    };
  };

  var colorDistance = function(c1, c2) {
    return Math.sqrt(Math.pow(c2[0] - c1[0], 2) + Math.pow(c2[1] - c1[1], 2) + Math.pow(c2[2] - c1[2], 2));
  };

  var distanceToColor = function(color) {
    return function(c1) {
      return colorDistance(c1, color);
    };
  };

  var bestColorOption = function(palette, matchColor) {
    if (palette === null || palette.length < 1 || !matchColor) {
      return '#afa0af';
    }

    palette = angular.copy(palette);

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
    getResizeData: getResizeData,
    bestColorOption: bestColorOption,
    rgbToHex: rgbToHex
  };
}