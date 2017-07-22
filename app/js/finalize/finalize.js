'use strict';

angular.module('app').directive('finalize', [finalize]);

function FinalizeCtrl($timeout, $uibModal) {
  var ctrl = this;

  ctrl.$onInit = function() {
    $timeout(function() {
      paper.install(window);
    });
  };

  ctrl.checkout = function() {
    $uibModal.open({
      component: 'finalizeModal',
      size: 'lg',
      windowClass: 'finalize-modal',
      backdrop: 'static'
    }).closed.then(function() {
      console.log('Done');
    });
  };
}

function finalize() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      buttonText: '@'
    },
    controller: [
      '$timeout', '$uibModal', FinalizeCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/finalize/finalize.html'
  };
}