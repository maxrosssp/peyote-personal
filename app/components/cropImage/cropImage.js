'use strict';

angular.module('app').directive('peyoteCrop', [cropImage]);

function CropImageCtrl($scope, $timeout, Cropper, PEYOTE_VALUES, CropImageService, $colorThief) {
  var ctrl = this;
  var file, data, showCropper, hideCropper;
  var cropBoxAspectRatio, imageAspectRatio, containerData;
  var zoomRatio;
  var rotation = 0;

  ctrl.$onInit = function() {
    zoomRatio = 0;

    ctrl.cropper = {};
    ctrl.cropperProxy = 'ctrl.cropper.callMethod';
    ctrl.showEvent = 'show';
    ctrl.hideEvent = 'hide';

    showCropper = function() { $scope.$broadcast(ctrl.showEvent); }
    hideCropper = function() { $scope.$broadcast(ctrl.hideEvent); }

    ctrl.options = {
      viewMode: 3,
      dragMode: 'move',
      preview: 'preview-container',
      cropBoxMovable: false,
      cropBoxResizable: false,
      doubleClickToggle: false,
      minContainerWidth: 420,
      crop: crop,
      dragend: dragend,
      zoomin: dragend,
      zoomout: dragend
    };

    var ppb = PEYOTE_VALUES.pixelsPerBead;
    ctrl.heightOptions = PEYOTE_VALUES.heightOptions;
    ctrl.widthOptions = PEYOTE_VALUES.widthOptions;

    ctrl.selectedHeight = ctrl.heightOptions[0].beads;
    ctrl.selectedWidth = ctrl.widthOptions[0].beads;

    ctrl.previewHeight = 650;
    ctrl.previewWidth = 120;

    ctrl.cropData = cropData;

    $timeout(showCropper);
  };

  ctrl.$onChanges = function(changesObj) {
    if (changesObj.blob && changesObj.blob.currentValue) {
      Cropper.encode((file = changesObj.blob.currentValue))
      .then(function(dataUrl) {
        ctrl.cropper.callMethod('replace', dataUrl);

        $timeout(function() {
          ctrl.cropper.callMethod('setDragMode', 'move');
          containerData = ctrl.cropper.callMethod('getContainerData');

          ctrl.cropper.callMethod('setCanvasData', {
            top: 0,
            height: containerData.height
          });

          ctrl.showEditButtons = true;

          ctrl.updatePreview();
        });
      });
    }
  };

  var setupContainer = function() {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('setAspectRatio', cropBoxAspectRatio);
    var canvasData = ctrl.cropper.callMethod('getCanvasData');
    var imageData = ctrl.cropper.callMethod('getImageData');

    var cropBoxResizeData = {
      width: containerData.height * cropBoxAspectRatio,
      height: containerData.height,
      top: 0
    };
    cropBoxResizeData.left = (containerData.width - cropBoxResizeData.width) / 2;

    var imageResizeData;
    if (canvasData.width < cropBoxResizeData.width) {
      imageResizeData = {
        width: cropBoxResizeData.width,
        height: cropBoxResizeData.width / imageData.aspectRatio
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

    fixEmptyCorners();
  };

  var fixEmptyCorners = function() {
    var cropData = ctrl.cropper.callMethod('getCropBoxData');
    var imageData = ctrl.cropper.callMethod('getImageData');
    var canvasData = ctrl.cropper.callMethod('getCanvasData');

    var maxSide = CropImageService.calculateZoomRatio(cropData, imageData);
  }

  ctrl.updateSize = function() {
    cropBoxAspectRatio = (ctrl.selectedWidth * PEYOTE_VALUES.beadWidth) / (ctrl.selectedHeight * PEYOTE_VALUES.beadHeight);

    ctrl.previewWidth = parseInt(ctrl.previewHeight * cropBoxAspectRatio);

    setupContainer();
  };

  ctrl.rotate = function(delta) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('rotate', delta);
  };

  ctrl.setRotation = function(delta) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('rotate', rotation - ctrl.rotation);
    rotation = ctrl.rotation;
  };

  ctrl.zoom = function(delta) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('zoom', delta);
  };

  var dragend = function() {
    $timeout(function() {
      ctrl.updatePreview();


      $scope.$broadcast('pixelize-pixel-preview', ctrl.previewUrl, ctrl.previewData, ctrl.palette);
    });
  };

  ctrl.updatePreview = function() {
    ctrl.updateSize();

    var previewData = cropData();
    ctrl.palette = $colorThief.getPalette(previewData, 3);

    ctrl.previewData = {
      height: 650,
      width: 150,
      rows: ctrl.selectedHeight,
      columns: ctrl.selectedWidth
    };

    ctrl.previewUrl = previewData.toDataURL();
  };

  var crop = function(dataNew) {
    data = dataNew;
  };

  var cropData = function() {
    if (!file || !data) return;

    var imgData = ctrl.cropper.callMethod('getCroppedCanvas');

    var palette = $colorThief.getPalette(imgData, 3);
    var fillColor = CropImageService.bestColorOption(palette, ctrl.dominantColor);

    return ctrl.cropper.callMethod('getCroppedCanvas', {fillColor: CropImageService.rgbToHex(fillColor)});
  };
}

function cropImage() {
  return {
    restrict: 'E',
    require: '^^FinalizeModalCtrl',
    scope: {},
    bindToController: {
      blob: '<',
      selectedHeight: '=beadHeight',
      selectedWidth: '=beadWidth',
      cropData: '='
    },
    controller: [
      '$scope', '$timeout', 'Cropper', 'PEYOTE_VALUES', 'CropImageService', '$colorThief', CropImageCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'components/cropImage/cropImage.html'
  };
}