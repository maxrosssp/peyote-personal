'use strict';

angular.module('app').directive('makePayment', [makePayment]);

function MakePaymentCtrl($window, STRIPE) {
  var ctrl = this;
  var document, stripe;
  var cardNumber;
  var cardBrandToPfClass;

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

      setOutcome(event);
    });
  };

  ctrl.createToken = function() {
    var form = document.querySelector('form');
    var extraDetails = {
      name: ctrl.cardholderName,
      address_zip: ctrl.zipCode
    };
    stripe.createToken(cardNumber, extraDetails).then(setOutcome);
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

  var setOutcome = function(result) {
    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');

    if (result.token) {
      successElement.querySelector('.token').textContent = result.token.id;
      successElement.classList.add('visible');
    } else if (result.error) {
      errorElement.textContent = result.error.message;
      errorElement.classList.add('visible');
    }
  };

  ctrl.checkout = function() {

  };
}

function makePayment() {
  return {
    restrict: 'E',
    scope: {},
    controller: [
      '$window', 'STRIPE', MakePaymentCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'components/payment/makePayment.html'
  };
}