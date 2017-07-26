'use strict';

angular.module('app').directive('orderReview', [orderReview]);

function OrderReviewCtrl(OrderReviewService) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.templatePrice = 20;
    ctrl.pricePerSquareInch = 1.5;
    ctrl.pricePerColor = 1;
    ctrl.priceForClasps = 3;
    ctrl.priceToShip = 5;
    ctrl.salesTax = 0.06;

    ctrl.mustShip = mustShip;
  };

  var mustShip = function() {
    return ctrl.includeBeads || ctrl.includeClasps;
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
      includeBeads: ctrl.includeBeads,
      includeClasps: ctrl.includeClasps
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
      'OrderReviewService', OrderReviewCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/orderReview/orderReview.html'
  };
}