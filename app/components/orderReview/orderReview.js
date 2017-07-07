'use strict';

angular.module('app').directive('orderReview', [orderReview]);

function OrderReviewCtrl($scope) {
  var ctrl = this;

  ctrl.$onInit = function(blob) {
    
  };
}

function orderReview() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      colorCount: '=',
      size: '<'
    },
    controller: [
      OrderReviewCtrl
    ],
    templateUrl: 'components/orderReview/orderReview.html'
  };
}