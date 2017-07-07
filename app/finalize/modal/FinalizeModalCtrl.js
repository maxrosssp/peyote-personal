'use strict';

angular.module('app').controller('FinalizeModalCtrl', [
  '$uibModalInstance', '$timeout', FinalizeModalCtrl
]);

function FinalizeModalCtrl($uibModalInstance, $timeout) {
  var ctrl = this;
  ctrl.currentPage = 'uploadImage';
  ctrl.modalPages = {
    uploadImage: {
      title: 'Upload Image'
    },
    cropImage: {
      title: 'Crop Image'
    },
    finalizeImage: {
      title: 'Finalize Image'
    },
    addPayment: {
      title: 'Add Payment'
    }
  };

  ctrl.onFile = function(blob) {
    $timeout(function() {
      ctrl.blob = blob;

      ctrl.currentPage = 'cropImage';
    });
  };

  ctrl.canContinue = function() {
    if (ctrl.currentPage === 'uploadImage') {
      return angular.isDefined(ctrl.blob);
    }
  };

  ctrl.cropAndContinue = function() {
    ctrl.croppedDataUrl = ctrl.cropData();
    ctrl.currentPage = 'addPayment';
  };

  ctrl.close = function() {
    var croppedDataUrl;

    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
      croppedDataUrl = dataUrl;
    });

    $uibModalInstance.close(ctrl.selectedSize, ctrl.colorCount, ctrl.croppedData.url);
  };
}
