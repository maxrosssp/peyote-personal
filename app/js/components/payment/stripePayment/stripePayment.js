'use strict';

angular.module('app').directive('stripePayment', [stripePayment]);

function StripePaymentCtrl($scope, $q, stripe, CARD_TYPES) {
  var ctrl = this;
  ctrl.zipLength = 5;

  ctrl.$onInit = function() {
    ctrl.getToken = getToken;
    ctrl.card = {};
    ctrl.paymentForm = {};
    ctrl.canCreateToken = ctrl.paymentForm.$valid;

    $scope.$watch(ctrl.card.cvc, function(newValue, oldValue) {
      if (newValue && newValue.length > CARD_TYPES[ctrl.paymentForm.cardNumber.$ccEagerType].cvcLength) {
        ctrl.card.cvc = oldValue;
      }
    });
  };

  ctrl.getPfClass = function(type) {
    return type ? CARD_TYPES[type].iconClass : 'pf-credit-card';
  };

  ctrl.inputClass = function(fieldName) {
    if (ctrl.paymentForm[fieldName] && decorateInput(fieldName)) {
      return ctrl.paymentForm[fieldName].$invalid ? 'has-error' : 'has-success';
    }

    return '';
  };

  var decorateInput = function(fieldName) {
    var formField = ctrl.paymentForm[fieldName]

    if (formField.$pristine) {
      return false;
    }

    switch (fieldName) {
      case 'cardNumber':
        return formField.$ccEagerType ? (CARD_TYPES[formField.$ccEagerType].possibleLengths
          .indexOf(formField.$$rawModelValue.length) !== -1) : false;
      case 'cardCvc':
        return formField.$$rawModelValue.length >= 3;
      case 'cardAddressZip':
        return formField.$$rawModelValue.length >= 5;
      default:
        return true;
    }
  };

  var getToken = function() {
    return stripe.card.createToken(ctrl.card);
  };
}

function stripePayment() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      getToken: '=',
      canCreateToken: '='
    },
    controller: [
      '$scope', '$q', 'stripe', 'CARD_TYPES', StripePaymentCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/payment/stripePayment/stripePayment.html'
  };
}