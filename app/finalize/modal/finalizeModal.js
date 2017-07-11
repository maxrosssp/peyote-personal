'use strict';

angular.module('app').directive('finalizeModal', [finalizeModal]);

function FinalizeModalCtrl($scope, $timeout, $colorThief) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.modalPages = {
      uploadImage: {
        id: 'uploadImage',
        title: 'Upload Image',
        next: 'cropImage'
      },
      cropImage: {
        id: 'cropImage',
        back: 'uploadImage',
        title: 'Crop Image',
        next: 'reviewOrder'
      },
      reviewOrder: {
        id: 'reviewOrder',
        back: 'cropImage',
        title: 'Review Order',
        next: 'addPayment'
      },
      addPayment: {
        id: 'addPayment',
        back: 'reviewOrder',
        title: 'Add Payment'
      }
    };

    ctrl.currentPage = ctrl.modalPages.uploadImage;
  };

  ctrl.goToNextPage = function() {
    ctrl.currentPage = ctrl.modalPages[ctrl.currentPage.next];
  };

  ctrl.goToPreviousPage = function() {
    ctrl.currentPage = ctrl.modalPages[ctrl.currentPage.back];
  };

  ctrl.onFile = function(blob) {
    ctrl.blob = blob;

    $timeout(function() {
      ctrl.blob = blob;

      ctrl.goToNextPage();
    });
  };

  ctrl.imageUploaded = function() {
    if (ctrl.currentPage.id === 'uploadImage') {
      return angular.isDefined(ctrl.blob);
    }
  };

  ctrl.cropAndContinue = function() {
    var croppedData = ctrl.cropData();

    ctrl.previewUrl = croppedData.toDataURL()
    ctrl.previewData = {
      height: 650,
      width: 150,
      rows: ctrl.selectedHeight,
      columns: ctrl.selectedWidth,
    };

    ctrl.palette = $colorThief.getPalette(croppedData, ctrl.colorCount || 12);

    ctrl.currentPage = 'reviewOrder';

    $scope.$broadcast('pixelize-review-order-preview', croppedData.toDataURL(), ctrl.previewData, ctrl.palette);
  };

  ctrl.close = function() {
    var croppedDataUrl;

    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
      croppedDataUrl = dataUrl;
    });

    modalInstance.close(ctrl.selectedSize, ctrl.colorCount, ctrl.croppedData.url);
  };
}

function finalizeModal() {
  return {
    restrict: 'E',
    scope: {},
    bindings: {
      modalInstance: '<'
    },
    controller: [
      '$scope', '$timeout', '$colorThief', FinalizeModalCtrl
    ],
    controllerAs: 'ctrl',
    link: function(scope, element, attrs, ctrl) {
      paper.install(scope);

      scope.$on('goToPage', function(event, page) {
        ctrl.currentPage = ctrl.modalPages[page];
      });
    },
    templateUrl: 'finalize/modal/finalizeModal.html'
  };
}
