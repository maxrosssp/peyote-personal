'use strict';

angular.module('app').directive('makePayment', [makePayment]);

function MakePaymentCtrl($window, STRIPE) {
  var ctrl = this;
  var document;

  ctrl.$onInit = function() {
    document = angular.element($window.document)[0];

    var stripe = $window.Stripe(STRIPE.publishableKey);
    var elements = stripe.elements();
    var cardNumber = elements.create('cardNumber', {
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
      setOutcome(event);
    });

    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      var form = document.querySelector('form');
      var extraDetails = {
        name: form.querySelector('input[name=cardholder-name]').value,
      };
      stripe.createToken(card, extraDetails).then(setOutcome);
    });
  };

  var setOutcome = function(result) {
    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');

    if (result.token) {
      // Use the token to create a charge or a customer
      // https://stripe.com/docs/charges
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