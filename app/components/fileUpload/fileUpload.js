'use strict';

angular.module('app').directive('fileUpload', [fileUpload]);

function fileUpload() {
  return {
    restrict: 'E',
    require: '^^finalizeModal',
    scope: {
      label: '<'
    },
    link: function(scope, element, attrs, FinalizeModalCtrl) {
      scope.onUpload = FinalizeModalCtrl.onFile;
    },
    templateUrl: 'components/fileUpload/fileUpload.html'
  };
}