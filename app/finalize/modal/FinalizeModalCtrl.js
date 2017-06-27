'use strict';

angular.module('app').controller('FinalizeModalCtrl', [
  '$uibModalInstance', '$scope', '$timeout', 'Cropper', 'PEYOTE_VALUES', FinalizeModalCtrl
]);

function FinalizeModalCtrl($uibModalInstance, $scope, $timeout, Cropper, PEYOTE_VALUES) {
  var ctrl = this;
  var file, data, showCropper, hideCropper;
  var cropBoxAspectRatio, imageAspectRatio, containerData;
  var zoomRatio;

  ctrl.$onInit = function() {
    ctrl.currentPage = 'uploadImage';
    zoomRatio = 0;

    ctrl.cropper = {};
    ctrl.cropperProxy = 'ctrl.cropper.callMethod';
    ctrl.showEvent = 'show';
    ctrl.hideEvent = 'hide';

    showCropper = function() { $scope.$broadcast(ctrl.showEvent); }
    hideCropper = function() { $scope.$broadcast(ctrl.hideEvent); }

    ctrl.options = {
      dragMode: 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      doubleClickToggle: false,
      minContainerWidth: 420,
      crop: function(dataNew) {
        data = dataNew;
      }
    };

    var ppb = PEYOTE_VALUES.pixelsPerBead;
    ctrl.sizeOptions = PEYOTE_VALUES.sizesByInch.map(function(size) {
      var pixelHeight = (Math.floor((PEYOTE_VALUES.pixelsPerInch * size.inches) / ppb) * ppb) + (ppb / 2)
      return {value: pixelHeight, description: size.description + ' (' + size.inches + '")'}
    });
    ctrl.selectedSize = ctrl.sizeOptions[0].value;
    cropBoxAspectRatio = PEYOTE_VALUES.braceletPixelWidth / ctrl.selectedSize;

    $timeout(showCropper);
  };

  ctrl.onFile = function(blob) {
    Cropper.encode((file = blob)).then(function(dataUrl) {
      ctrl.imageUploaded = true;
      ctrl.dataUrl = dataUrl;
      ctrl.cropper.callMethod('replace', dataUrl);
    }).then(function() {
      $timeout(function() {
        ctrl.cropper.callMethod('setDragMode', 'move');
        containerData = ctrl.cropper.callMethod('getContainerData');
        var imageData = ctrl.cropper.callMethod('getImageData');

        imageAspectRatio = imageData.aspectRatio;

        ctrl.cropper.callMethod('setCanvasData', {
          top: 0,
          height: containerData.height
        });

        ctrl.selectSize();

        ctrl.totalPages = 2;
      });
    });
  };

  var setupContainer = function() {
    if (!ctrl.cropper.callMethod) return;

    var cropBoxResizeData = {
      width: containerData.height * cropBoxAspectRatio,
      height: containerData.height,
      top: 0
    };
    cropBoxResizeData.left = (containerData.width - cropBoxResizeData.width) / 2;

    var canvasData = ctrl.cropper.callMethod('getCanvasData');
    var imageResizeData;
    if (canvasData.width < cropBoxResizeData.width) {
      imageResizeData = {
        width: cropBoxResizeData.width,
        height: cropBoxResizeData.width / imageAspectRatio
      };
    }

    var cropBoxResizeDataRight = cropBoxResizeData.left + cropBoxResizeData.width;
    var imageDataRight = canvasData.left + canvasData.width;
    if (cropBoxResizeData.left < canvasData.left) {
      imageResizeData = imageResizeData || {};
      imageResizeData.left = cropBoxResizeData.left;
    } else if (cropBoxResizeDataRight > imageDataRight) {
      imageResizeData = imageResizeData || {};
      imageResizeData.left = canvasData.left + (cropBoxResizeDataRight - imageDataRight);
    }

    if (imageResizeData) {
      ctrl.cropper.callMethod('setCanvasData', imageResizeData);
    }

    ctrl.cropper.callMethod('setCropBoxData', cropBoxResizeData);
  };

  ctrl.selectSize = function() {
    if (!ctrl.cropper.callMethod) return;
    cropBoxAspectRatio = PEYOTE_VALUES.braceletPixelWidth / ctrl.selectedSize;
    ctrl.cropper.callMethod('setAspectRatio', cropBoxAspectRatio);
    setupContainer();
  };

  ctrl.rotate = function(delta) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('rotate', delta);
  };

  ctrl.zoom = function(delta) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('zoom', delta);
  };

  ctrl.preview = function() {
    if (!file || !data) return;
    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
      (ctrl.preview || (ctrl.preview = {})).dataUrl = dataUrl;
    });
  };

  ctrl.clear = function(degrees) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('clear');
  };

  ctrl.scale = function(width) {
    Cropper.crop(file, data)
      .then(function(blob) {
        return Cropper.scale(blob, {width: width});
      })
      .then(Cropper.encode).then(function(dataUrl) {
        (ctrl.preview || (ctrl.preview = {})).dataUrl = dataUrl;
      });
  };

  ctrl.crop = function(dataNew) {
    data = dataNew;
  };

  ctrl.close = function() {
    var croppedDataUrl;

    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
      croppedDataUrl = dataUrl;
    });

    $uibModalInstance.close(ctrl.selectedSize, ctrl.colorCount, ctrl.croppedData.url);
  };
}
