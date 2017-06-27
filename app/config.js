angular.module('app').config(['$locationProvider', '$routeProvider', 'stripeProvider', 'STRIPE', Config]);

function Config($locationProvider, $routeProvider, stripeProvider, STRIPE) {
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

  stripeProvider.setPublishableKey(STRIPE.publishableKey);
}
