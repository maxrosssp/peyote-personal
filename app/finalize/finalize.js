'use strict';

angular.module('app').directive('finalize', [finalize]);

function FinalizeCtrl($uibModal) {
  var ctrl = this;

  ctrl.$onInit = function() {
  };

  ctrl.checkout = function() {
    $uibModal.open({
      templateUrl: 'finalize/modal/finalizeModal.html',
      controller: 'FinalizeModalCtrl',
      controllerAs: 'ctrl',
      size: 'lg',
      windowClass: 'finalize-modal'
    }).closed.then(function() {
      console.log('Done');
    });
  };
}

function finalize() {
  return {
    restrict: 'E',
    scope: {},
    controller: [
      '$uibModal', FinalizeCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'finalize/finalize.html'
  };
}