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
      onUpload: '='
    },
    controller: [
      '$scope', FileUploadCtrl
    ],
    template: '<input type="file" onchange="angular.element(this).scope().onUpload(this.files[0])">'
  };
}