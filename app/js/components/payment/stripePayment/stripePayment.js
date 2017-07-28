'use strict';

angular.module('app').directive('stripePayment', [stripePayment]);

function StripePaymentCtrl($scope, $q, stripe) {
  var ctrl = this;
  var cardTypes = {
    'Visa': {
      'iconClass': 'pf-visa',
      'possibleLengths': [16, 19],
      'cvcLength': 3
    },
    'Maestro': {
      'iconClass': 'pf-credit-card',
      'possibleLengths': [16, 19],
      'cvcLength': 3
    },
    'Forbrugsforeningen': {
      'iconClass': 'pf-credit-card',
      'possibleLengths': [16],
      'cvcLength': 3
    },
    'Dankort': {
      'iconClass': 'pf-credit-card',
      'possibleLengths': [16],
      'cvcLength': 3
    },
    'MasterCard': {
      'iconClass': 'pf-mastercard',
      'possibleLengths': [16],
      'cvcLength': 3
    },
    'American Express': {
      'iconClass': 'pf-american-express',
      'possibleLengths': [15],
      'cvcLength': 4
    },
    'Diners Club': {
      'iconClass': 'pf-diners',
      'possibleLengths': [14],
      'cvcLength': 3
    },
    'Discover': {
      'iconClass': 'pf-discover',
      'possibleLengths': [16],
      'cvcLength': 3
    },
    'JCB': {
      'iconClass': 'pf-jcb',
      'possibleLengths': [16],
      'cvcLength': 3
    },
    'UnionPay': {
      'iconClass': 'pf-credit-card',
      'possibleLengths': [16, 19],
      'cvcLength': 3
    }
  };

  ctrl.zipLength = 5;

  ctrl.$onInit = function() {
    ctrl.getToken = getToken;
    ctrl.card = {};
    ctrl.paymentForm = {};
    ctrl.canCreateToken = ctrl.paymentForm.$valid;

    $scope.$watch(ctrl.card.cvc, function(newValue, oldValue) {
      if (newValue && newValue.length > cardTypes[ctrl.paymentForm.cardNumber.$ccEagerType].cvcLength) {
        ctrl.card.cvc = oldValue;
      }
    });
  };

  ctrl.getPfClass = function(type) {
    return type ? cardTypes[type].iconClass : 'pf-credit-card';
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
        return formField.$ccEagerType ? (cardTypes[formField.$ccEagerType].possibleLengths
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
      '$scope', '$q', 'stripe', StripePaymentCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/payment/stripePayment/stripePayment.html'
  };
}