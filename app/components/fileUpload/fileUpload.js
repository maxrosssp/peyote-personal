'use strict';

angular.module('app').directive('fileUpload', [fileUpload]);

function FileUploadCtrl($scope) {
  var ctrl = this;

  $scope.onUpload = function(blob) {
    ctrl.onUpload(blob);
  };
}

function fileUpload() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      onUpload: '=',
      label: '<'
    },
    controller: [
      '$scope', FileUploadCtrl
    ],
    templateUrl: 'components/fileUpload/fileUpload.html'
  };
}