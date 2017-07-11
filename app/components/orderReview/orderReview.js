'use strict';

angular.module('app').directive('orderReview', [orderReview]);

function OrderReviewCtrl($scope, $timeout, $colorThief) {
  var ctrl = this;

  ctrl.$onInit = function() {
    // var previewData = {
    //   url: ctrl.imageData.toDataURL(),
    //   height: 650,
    //   width: 150,
    //   rows: ctrl.beadHeight,
    //   columns: ctrl.beadWidth
    // };
    // $timeout(function() {
    //   ctrl.palette = $colorThief.getPalette(ctrl.imageData, ctrl.colorCount || 12);
    // });
  };

  ctrl.$onChanges = function(changesObj) {
    // if (changesObj.imageData.currentValue) {
      // $timeout(function() {
        // ctrl.previewData.url = changesObj.imageData.currentValue.toDataURL();
        // ctrl.palette = $colorThief.getPalette(changesObj.imageData.currentValue, ctrl.colorCount || 12);
        // ctrl.imageUrl = ctrl.imageData.toDataURL();
        // ctrl.previewData.url = ctrl.imageUrl;
        // ctrl.palette = $colorThief.getPalette(ctrl.imageData, ctrl.colorCount || 12);
      // });
    // }

    // if (changesObj.beadHeight.currentValue) {
    //   ctrl.previewData.rows = ctrl.beadHeight;
    // }

    // if (changesObj.beadWidth.currentValue) {
    //   ctrl.previewData.columns = ctrl.beadWidth;
    // }

    // console.log(ctrl);
    // console.log(changesObj);
  };
}

function orderReview() {
  return {
    restrict: 'E',
    require: '^^FinalizeModalCtrl',
    scope: {},
    bindToController: {
      pixelizeId: '@',
      endClasps: '='
    },
    controller: [
      '$scope', '$timeout', '$colorThief', OrderReviewCtrl
    ],
    templateUrl: 'components/orderReview/orderReview.html'
  };
}