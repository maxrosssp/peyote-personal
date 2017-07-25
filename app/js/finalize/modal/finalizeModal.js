'use strict';

angular.module('app').directive('finalizeModal', [finalizeModal]);

function FinalizeModalCtrl($scope, $timeout, $colorThief, PEYOTE_VALUES) {
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
    ctrl.colorCount = 12;
    ctrl.orderReviewPixelizerId = 'review-order-preview';

    $scope.$on('can-continue-with-payment', function(event, validPayment) {
      $timeout(function() {
        ctrl.canContinueWithPayment = validPayment;
      });
    });
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
    var cropBoxAspectRatio = (ctrl.selectedWidth * PEYOTE_VALUES.beadWidth) / (ctrl.selectedHeight * PEYOTE_VALUES.beadHeight);
    ctrl.previewWidth = parseInt(650 * cropBoxAspectRatio);

    ctrl.getCroppedData()
    .then(function(croppedData) {
      var previewUrl = croppedData.toDataURL();
      var previewData = {rows: ctrl.selectedHeight, columns: ctrl.selectedWidth};
      var palette = $colorThief.getPalette(croppedData, ctrl.colorCount);

      $scope.$broadcast('pixelize-' + ctrl.orderReviewPixelizerId, previewUrl, previewData, palette);

      return previewUrl;
    })
    .then(function(previewUrl) {
      ctrl.goToNextPage();
    });
  };

  ctrl.payAndContinue = function() {
    return ctrl.checkout()
    .then(function(res) {
      console.log(res);
    });
  };

  ctrl.close = function() {
    ctrl.modalInstance.close();
  };
}

function finalizeModal() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      modalInstance: '='
    },
    controller: [
      '$scope', '$timeout', '$colorThief', 'PEYOTE_VALUES', FinalizeModalCtrl
    ],
    controllerAs: 'ctrl',
    link: function(scope, element, attrs, ctrl) {
      paper.install(scope);

      scope.$on('goToPage', function(event, page) {
        ctrl.currentPage = ctrl.modalPages[page];
      });
    },
    templateUrl: 'js/finalize/modal/finalizeModal.html'
  };
}
