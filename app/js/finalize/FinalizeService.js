'use strict';

angular.module('app').factory('FinalizeService', [
  '$http', FinalizeService
]);

function FinalizeService($http) {
  var stripeCheckout = function(imageUrl, specs, token, couponCode) {
    return $http({
      method: 'POST',
      url: '/checkout',
      data: {
        url: imageUrl,
        specs: specs,
        token: token,
        couponCode: couponCode
      }
    });
  };

  var finalize = function(imageUrl, specs, token, couponCode) {
    return stripeCheckout(imageUrl, specs, token, couponCode)
    .then(function(response) {
      console.log('Done with checkout');
      console.log(response);

      return response;
    })
    .catch(function(err) {
      console.log('There was an error');
      console.log(err);

      throw err;
    });
  };

	return {
		finalize: finalize
	};
}