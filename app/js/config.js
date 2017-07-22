angular.module('app').config(['$locationProvider', '$routeProvider', 'STRIPE', Config]);

function Config($locationProvider, $routeProvider, STRIPE) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });

  $routeProvider.when('/', {
    templateUrl: 'js/views/home/home.html'
  });

  $routeProvider.otherwise({redirectTo: '/'});

  // $window.Stripe.setPublishableKey(STRIPE.publishableKey);
}
