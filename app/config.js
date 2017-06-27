angular.module('app').config(['$locationProvider', '$routeProvider', 'STRIPE', Config]);

function Config($locationProvider, $routeProvider, STRIPE) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });

  $routeProvider.when('/viewOne', {
    template: '<view-one></view-one>'
  });

  $routeProvider.when('/finalize', {
    template: '<finalize></finalize>'
  });

  $routeProvider.otherwise({redirectTo: '/viewOne'});

  // $window.Stripe.setPublishableKey(STRIPE.publishableKey);
}
