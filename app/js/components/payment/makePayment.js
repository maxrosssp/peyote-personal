'use strict';

angular.module('app').directive('makePayment', [makePayment]);

function MakePaymentCtrl($scope, $window, $q, STRIPE) {
  var ctrl = this;
  var document, stripe;
  var cardNumber;
  var cardBrandToPfClass;

  var triedToCreateToken;
  var validation = {};

  ctrl.$onInit = function() {
    ctrl.zipCodeLength = 5;
    cardBrandToPfClass = {
      'visa': 'pf-visa',
      'mastercard': 'pf-mastercard',
      'amex': 'pf-american-express',
      'discover': 'pf-discover',
      'diners': 'pf-diners',
      'jcb': 'pf-jcb',
      'unknown': 'pf-credit-card',
    };

    document = angular.element($window.document)[0];
    stripe = $window.Stripe(STRIPE.publishableKey);

    var charges = stripe.charges;

    var elements = stripe.elements();
    cardNumber = elements.create('cardNumber', {
      classes: {base: 'form-control'}
    });
    var cardExpiry = elements.create('cardExpiry', {
      classes: {base: 'form-control'}
    });
    var cardCvc = elements.create('cardCvc', {
      classes: {base: 'form-control'}
    });
    cardNumber.mount('#card-number');
    cardExpiry.mount('#card-expiry');
    cardCvc.mount('#card-cvc');

    cardNumber.on('change', function(event) {
      if (event.brand) {
        setBrandIcon(event.brand);
      }

      validation.cardNumber = event.complete;

      ctrl.canContinue();
    });

    cardExpiry.on('change', function(event) {
      validation.cardExpiry = event.complete;

      ctrl.canContinue()
    });

    cardCvc.on('change', function(event) {
      validation.cardCvc = event.complete;

      ctrl.canContinue();
    });

    triedToCreateToken = canTryToCreateToken();
  };

  var canTryToCreateToken = function() {
    if (!(validation.cardNumber && validation.cardExpiry && validation.cardCvc)) {
      return false;
    }

    if (!ctrl.cardholderName) {
      return false;
    }

    if (!ctrl.zipCode || ctrl.zipCode.length < 5) {
      return false;
    }

    return true;
  };

  ctrl.canContinue = function() {
    if (triedToCreateToken && !canTryToCreateToken()) {
      $scope.$emit('can-continue-with-payment', false);
      triedToCreateToken = false;
    } else if (!triedToCreateToken && canTryToCreateToken()) {
      $scope.$emit('can-continue-with-payment', true);
      triedToCreateToken = true;
      createToken();
    }
  };

  var setBrandIcon = function(brand) {
    var brandIconElement = document.getElementById('brand-icon');
    var pfClass = 'pf-credit-card';
    if (brand in cardBrandToPfClass) {
      pfClass = cardBrandToPfClass[brand];
    }
    for (var i = brandIconElement.classList.length - 1; i >= 0; i--) {
      brandIconElement.classList.remove(brandIconElement.classList[i]);
    }
    brandIconElement.classList.add('pf');
    brandIconElement.classList.add(pfClass);
  };

  // var setOutcome = function(result) {
  //   // var successElement = document.querySelector('.success');
  //   // var errorElement = document.querySelector('.error');
  //   // successElement.classList.remove('visible');
  //   // errorElement.classList.remove('visible');

  //   if (result.token) {
  //     console.log(result.token);
  //     $scope.$emit('can-continue-with-payment', true);
  //     // successElement.querySelector('.token').textContent = result.token.id;
  //     // successElement.classList.add('visible');
  //   } else if (result.error) {
  //     console.log(result.error);
  //     $scope.$emit('can-continue-with-payment', false);
  //     // errorElement.textContent = result.error.message;
  //     // errorElement.classList.add('visible');
  //   }
  // };

  var createToken = function() {
    var extraDetails = {
      name: ctrl.cardholderName,
      address_zip: ctrl.zipCode
    };

    return stripe.createToken(cardNumber, extraDetails)
    .then(function(result) {
      return result.token || $q.reject(result.error || result);
    });
  };

  ctrl.checkout = function() {
    return createToken()
    .then(function(token) {

    })
    .catch(function(error) {

    });

    stripe.createToken(cardNumber, extraDetails)
    .then(function(result) {
      if (result.token) {
      } else if (result.error) {
      }
    });
  };
}

function makePayment() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      mustShip: '&',
      totalPrice: '<'
    },
    controller: [
      '$scope', '$window', '$q', 'STRIPE', MakePaymentCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/payment/makePayment.html'
  };
}