'use strict';

angular.module('app').directive('makePayment', [makePayment]);

function MakePaymentCtrl($scope, $window, $q, $http, STRIPE, FinalizeService) {
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

    ctrl.stripeCharge = checkout;
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

  var createToken = function() {
    var extraDetails = {
      name: ctrl.cardholderName,
      address_zip: ctrl.zipCode
    };

    var deferred = $q.defer();

    stripe.createToken(cardNumber, extraDetails)
    .then(function(result) {
      if (result.token) { 
        deferred.resolve({
          token: result.token.id,
          name: ctrl.cardholderName
        });
      } else {
        deferred.reject(result.error || result);
      }
    })
    .catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var checkout = function(finalCroppedData, finalSpecs) {
    return createToken()
    .then(function(tokenData) {
      return FinalizeService.finalize(finalCroppedData, finalSpecs, tokenData);
      // return stripeCheckout(token, ctrl.totalPrice * 100);
    })
    .catch(function(error) {
      return $q.reject();
    });
  };

  var stripeCheckout = function(token, amount, description) {
    return $http({
      method: 'POST',
      url: '/charge',
      data: {
        amount: amount,
        currency: 'usd',
        description: description || 'Test checkout',
        source: token
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
      totalPrice: '<',
      stripeCharge: '='
    },
    controller: [
      '$scope', '$window', '$q', '$http', 'STRIPE', 'FinalizeService', MakePaymentCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/payment/makePayment.html'
  };
}