angular.module('app').config(['$locationProvider', '$routeProvider', '$qProvider', 'STRIPE', Config]);

function Config($locationProvider, $routeProvider, $qProvider, STRIPE) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });

  $routeProvider
  .when('/home', {
    templateUrl: 'js/views/home.html'
  })
  .when('/about', {
    templateUrl: 'js/views/about.html'
  })
  .when('/faq', {
    templateUrl: 'js/views/faq.html'
  })
  .when('/contact', {
    templateUrl: 'js/views/contact.html'
  });

  $routeProvider.otherwise({redirectTo: '/home'});

  $qProvider.errorOnUnhandledRejections(false);

  // $window.Stripe.setPublishableKey(STRIPE.publishableKey);
}
