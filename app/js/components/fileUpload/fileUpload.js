'use strict';

angular.module('app').directive('fileUpload', [fileUpload]);

function FileUploadCtrl($scope, $http) {
  var ctrl = this;

  ctrl.checkLink = function(link) {
    return getImageDataURL(link)
    .then(function(dataUrl) {
      $scope.onDownload(dataUrl);
    }).catch(function(err) {
      ctrl.linkError = true;
      ctrl.linkErrorMessage = err.data;
    });
  };

  ctrl.updateLink = function() {
    ctrl.linkError = false;
  };

  var getImageDataURL = function(url) {
    return $http({
      method: 'POST',
      url: '/image/download',
      data: {
        imageUrl: url
      }
    })
    .then(function(response) {
      return response.data;
    });
  };
}

function fileUpload() {
  return {
    restrict: 'E',
    require: '^^finalizeModal',
    scope: {},
    bindToController: {
      fileLabel: '<',
      linkLabel: '<'
    },
    controller: [
      '$scope', '$http', FileUploadCtrl
    ],
    controllerAs: 'ctrl',
    link: function(scope, element, attrs, FinalizeModalCtrl) {
      scope.onUpload = FinalizeModalCtrl.onFile;
      scope.onDownload = FinalizeModalCtrl.onLink;
    },
    templateUrl: 'js/components/fileUpload/fileUpload.html'
  };
}