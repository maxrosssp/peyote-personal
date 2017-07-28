'use strict';

angular.module('app').directive('makePayment', [makePayment]);

function MakePaymentCtrl(FinalizeService) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.finalizeCheckout = checkout;
  };

  var checkout = function(finalCroppedData, finalSpecs) {
    return ctrl.getToken()
    .then(function(token) {
      return FinalizeService.finalize(finalCroppedData, finalSpecs, token);
    });
  };
}

function makePayment() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      mustShip: '&',
      totalPrice: '<',
      finalizeCheckout: '=',
      canCreateToken: '='
    },
    controller: [
      'FinalizeService', MakePaymentCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/payment/makePayment.html'
  };
}