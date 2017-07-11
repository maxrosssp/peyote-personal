'use strict';

angular.module('app').directive('orderReview', [orderReview]);

function OrderReviewCtrl($scope, $timeout, $colorThief, PEYOTE_VALUES) {
  var ctrl = this;

  ctrl.$onInit = function() {
    var selectedHeight = PEYOTE_VALUES.heightOptions.find(function(option) {
      return option.beads === ctrl.beadHeight;
    });

    var selectedWidth = PEYOTE_VALUES.widthOptions.find(function(option) {
      return option.beads === ctrl.beadWidth;
    });

    var sizeInches = selectedHeight.inches + '" x ' + selectedWidth.inches + '"';
    var sizeBeads = parseInt(selectedHeight.beads) + ' x ' + selectedWidth.beads + ' beads';

    ctrl.templateSize = sizeInches + ' (' + sizeBeads + ')';
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
    require: '^^finalizeModal',
    scope: {},
    bindToController: {
      pixelizeId: '=',
      beadHeight: '=',
      beadWidth: '=',
      endClasps: '='
    },
    controller: [
      '$scope', '$timeout', '$colorThief', 'PEYOTE_VALUES', OrderReviewCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'components/orderReview/orderReview.html'
  };
}