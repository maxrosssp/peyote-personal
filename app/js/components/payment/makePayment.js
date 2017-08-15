'use strict';

angular.module('app').directive('makePayment', [makePayment]);

function MakePaymentCtrl($scope, $q, stripe, CARD_TYPES, FinalizeService, ngProgressFactory) {
  var ctrl = this;
  ctrl.zipLength = 5;

  ctrl.$onInit = function() {
    ctrl.card = {};
    ctrl.paymentForm = {};

    ctrl.finalizeCheckout = checkout;

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('7px');
    $scope.progressbar.setParent(angular.element(document.getElementById('make-payment-page'))[0]);

    $scope.$watch(ctrl.card.cvc, function(newValue, oldValue) {
      if (newValue && newValue.length > CARD_TYPES[ctrl.paymentForm.cardNumber.$ccEagerType].cvcLength) {
        ctrl.card.cvc = oldValue;
      }
    });

    $scope.$watch(function() {
      return ctrl.paymentForm.$valid && ctrl.cardholderInfo.$valid;
    }, function(newValue) {
      $scope.$emit('toggle-checkout-button', newValue);
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

  ctrl.updateFunctions = {
    cardNumber: function() {
      var cardType = CARD_TYPES[ctrl.paymentForm.cardNumber.$ccEagerType];
      if (cardType && ctrl.card.number.length > cardType.length) {
        ctrl.card.number = ctrl.card.number.slice(0, cardType.length);
      }

      // if (ctrl.paymentForm.cardNumber.$valid) ctrl.paymentForm.$$element[0].elements.cardCvc.focus();
    },
    cardCvc: function() {
      var cardType = CARD_TYPES[ctrl.paymentForm.cardNumber.$ccEagerType];
      if (cardType && ctrl.card.cvc.length > cardType.cvcLength) {
        ctrl.card.cvc = ctrl.card.cvc.slice(0, cardType.cvcLength);
      }

      // if (ctrl.paymentForm.cardCvc.$valid) ctrl.paymentForm.$$element[0].elements.cardExpMonth.focus();
    },
    cardExpMonth: function(event) {
      if (ctrl.card.exp_month > 12) {
        ctrl.card.exp_month = parseInt(ctrl.paymentForm.cardExpMonth.$viewValue[0]);
      }

      if (ctrl.card.exp_month > 1 || (ctrl.paymentForm.cardExpMonth.$viewValue && ctrl.paymentForm.cardExpMonth.$viewValue.length > 1)) {
        var expYearElement = ctrl.paymentForm.$$element[0].elements.cardExpYear;

        if (expYearElement) {
          expYearElement.focus();
        }
      }
    },
    cardExpYear: function(event) {
      if (!ctrl.paymentForm.cardExpYear.$viewValue[0] && (event.key === 'Backspace' || event.keyCode === 8)) {
        var expMonthElement = ctrl.paymentForm.$$element[0].elements.cardExpMonth;

        if (expMonthElement) {
          expMonthElement.focus();
        }
      }
    }
  };

  var decorateInput = function(fieldName) {
    var formField = ctrl.paymentForm[fieldName];

    if (formField.$pristine) {
      return false;
    }

    switch (fieldName) {
      case 'cardNumber':
        return formField.$ccEagerType ? (CARD_TYPES[formField.$ccEagerType].length === formField.$$rawModelValue.length) : false;
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

  var validateEmailsMatch = function() {
    return ctrl.email === ctrl.emailConfirm ? $q.resolve() : $q.reject({type: 'emailMatch', message: 'E-mails do not match'});
  };

  var checkout = function(finalCroppedData, finalSpecs) {
    $scope.progressbar.start();

    return validateEmailsMatch()
    .then(function() {
      return getToken();
    })
    .then(function(token) {
      $scope.progressbar.set(50);

      finalSpecs.email = ctrl.email;
      return FinalizeService.finalize(finalCroppedData, finalSpecs, token);
    })
    .catch(function(err) {
      if (err.type) {
        ctrl.error = err;
      } else {
        ctrl.errorAlert = err.data;
      }
    })
    .finally(function() {
      $scope.progressbar.complete();
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
      finalizeCheckout: '='
    },
    controller: [
      '$scope', '$q', 'stripe', 'CARD_TYPES', 'FinalizeService', 'ngProgressFactory', MakePaymentCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/payment/makePayment.html'
  };
}