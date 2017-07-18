'use strict';

angular.module('app').directive('peyoteCrop', [cropImage]);

function CropImageCtrl($scope, $q, $timeout, Cropper, PEYOTE_VALUES, CropImageService, $colorThief) {
  var ctrl = this;
  var file, data, showCropper, hideCropper, containerData, croppedData;
  var rotation = 0;

  ctrl.$onInit = function() {
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
      build: ctrl.updatePreview,
      dragend: ctrl.updatePreview,
      zoomin: ctrl.updatePreview,
      zoomout: ctrl.updatePreview,
      crop: function(dataNew) {
        data = dataNew;
      }
    };

    var ppb = PEYOTE_VALUES.pixelsPerBead;
    ctrl.heightOptions = PEYOTE_VALUES.heightOptions;
    ctrl.widthOptions = PEYOTE_VALUES.widthOptions;

    ctrl.selectedHeight = ctrl.heightOptions[0].beads;
    ctrl.selectedWidth = ctrl.widthOptions[0].beads;

    ctrl.previewHeight = 650;
    // ctrl.previewWidth = 120;

    ctrl.getCroppedData = getCroppedData;

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
    if (!ctrl.cropper.callMethod || !containerData) return;

    var cropBoxAspectRatio = (ctrl.selectedWidth * PEYOTE_VALUES.beadWidth) /
                              (ctrl.selectedHeight * PEYOTE_VALUES.beadHeight);

    ctrl.previewWidth = parseInt(ctrl.previewHeight * cropBoxAspectRatio);
    ctrl.cropper.callMethod('setAspectRatio', cropBoxAspectRatio);

    var resizeData = CropImageService.getResizeData(
      containerData,
      ctrl.cropper.callMethod('getCanvasData'),
      ctrl.cropper.callMethod('getImageData'),
      cropBoxAspectRatio
    );

    if (resizeData.image) {
      ctrl.cropper.callMethod('setCanvasData', resizeData.image);
    }

    ctrl.cropper.callMethod('setCropBoxData', resizeData.cropBox);
  };

  ctrl.rotate = function(delta) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('rotate', rotation - ctrl.rotation);
    rotation = ctrl.rotation;
  };

  ctrl.zoom = function(delta) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('zoom', delta);
  };

  ctrl.updatePreview = function() {
    setupContainer();

    return cropData(ctrl.previewHeight, ctrl.previewWidth)
    .then(function(previewBlob) {
      croppedData = previewBlob;

      ctrl.previewUrl = previewBlob.toDataURL();
    });
  };

  var cropData = function(height, width) {
    if (!file || !data) return $q.reject();

    return $q.resolve(ctrl.cropper.callMethod('getCroppedCanvas'))
    .then(function(imgData) {
      return $colorThief.getPalette(imgData, 3);
    })
    .then(function(palette) {
      return CropImageService.bestColorOption(palette, ctrl.dominantColor);
    })
    .then(function(fillColor) {
      return ctrl.cropper.callMethod('getCroppedCanvas', {
        height: height,
        width: width,
        fillColor: CropImageService.rgbToHex(fillColor)
      });
    });
  };

  var getCroppedData = function() {
    return $q.resolve(croppedData);
  };
}

function cropImage() {
  return {
    restrict: 'E',
    require: '^^finalizeModal',
    scope: {},
    bindToController: {
      blob: '<',
      selectedHeight: '=beadHeight',
      selectedWidth: '=beadWidth',
      colorCount: '=',
      getCroppedData: '='
    },
    controller: [
      '$scope', '$q', '$timeout', 'Cropper', 'PEYOTE_VALUES', 'CropImageService', '$colorThief', CropImageCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'components/cropImage/cropImage.html'
  };
}