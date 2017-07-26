'use strict';

angular.module('app').factory('FinalizeService', [
  '$http', FinalizeService
]);

function FinalizeService($http) {
  var uploadCanvas = function(canvas, name) {
    return $http({
      method: 'POST',
      url: '/upload',
      data: {
        blob: canvas.toDataURL(),
        key: name + '-' + (new Date().toISOString().replace(/(-|:|\.)/g, ''))
      }
    });
  };

  var stripeCheckout = function(token, specs) {
    return $http({
      method: 'POST',
      url: '/charge',
      data: {
        specs: specs,
        token: token
      }
    });
  };

  var finalize = function(canvas, specs, tokenData) {
    return uploadCanvas(canvas, tokenData.name)
    .then(function() {
      return stripeCheckout(tokenData.token, specs);
    });
  };

	return {
		finalize: finalize
	};
}