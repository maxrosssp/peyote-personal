angular.module('app').config(['$locationProvider', '$routeProvider', Config]);

function Config($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });

  $routeProvider.when('/viewOne', {
    template: '<view-one></view-one>'
  });

  $routeProvider.otherwise({redirectTo: '/viewOne'});
}
