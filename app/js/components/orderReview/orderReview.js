'use strict';

angular.module('app').directive('orderReview', [orderReview]);

function OrderReviewCtrl(PEYOTE_PRICES, OrderReviewService) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.disableShipping = PEYOTE_PRICES.disableShipping;

    ctrl.prices = PEYOTE_PRICES;

    ctrl.mustShip = mustShip;
  };

  var mustShip = function() {
    return ctrl.disableShipping ? false : (ctrl.includeBeads || ctrl.includeClasps);
  };

  ctrl.$onChanges = function(changesObj) {
    if (changesObj.beadHeight || changesObj.beadWidth) {
      ctrl.templateSize = OrderReviewService.calculateTemplateSize(ctrl.beadHeight, ctrl.beadWidth);
    }

    ctrl.updateFinalPrice();
  };

  ctrl.updateFinalPrice = function() {
    ctrl.subtotal = OrderReviewService.calculateSubtotal({
      templateSize: ctrl.templateSize,
      colorCount: ctrl.colorCount,
      includeBeads: (ctrl.disableShipping ? false : ctrl.includeBeads),
      includeClasps: (ctrl.disableShipping ? false : ctrl.includeClasps)
    });

    var shipAndTax = OrderReviewService.shippingAndTaxCost(ctrl.subtotal, mustShip());

    ctrl.finalPrice = ctrl.subtotal + shipAndTax;
  };
}

function orderReview() {
  return {
    restrict: 'E',
    require: '^^finalizeModal',
    scope: {},
    bindToController: {
      beadHeight: '<',
      beadWidth: '<',
      colorCount: '<',
      finalPrice: '=',
      includeBeads: '=',
      includeClasps: '=',
      mustShip: '='
    },
    controller: [
      'PEYOTE_PRICES', 'OrderReviewService', OrderReviewCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/orderReview/orderReview.html'
  };
}