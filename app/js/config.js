angular.module('app').config(['$locationProvider', '$routeProvider', 'STRIPE', Config]);

function Config($locationProvider, $routeProvider, STRIPE) {
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

  // $window.Stripe.setPublishableKey(STRIPE.publishableKey);
}
