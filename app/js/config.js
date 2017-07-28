angular.module('app').config(['$locationProvider', '$routeProvider', '$qProvider', 'stripeProvider', Config])

function Config($locationProvider, $routeProvider, $qProvider, stripeProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: false}).hashPrefix('!');

  $routeProvider
  .when('/', {
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
  $routeProvider.otherwise({redirectTo: '/'});

  $qProvider.errorOnUnhandledRejections(false);

  // stripeProvider.url = 'https://js.stripe.com/v3/';
  stripeProvider.setPublishableKey('pk_test_8lpNNwFVokUif3qxk2N7fPd6');
}