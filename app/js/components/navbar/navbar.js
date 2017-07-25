'use strict';

angular.module('app').directive('navbar', [navbar]);

function NavbarCtrl() {
  var ctrl = this;

  ctrl.$onInit = function() {
  };
}

function navbar() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
    },
    controller: [
      NavbarCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/navbar/navbar.html'
  };
}