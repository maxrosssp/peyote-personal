'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngCropper', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    controllerAs: 'ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$timeout', 'Cropper', function($scope, $timeout, Cropper) {
  var ctrl = this;
  var file, data;

  var braceletPixelWidth = 600;
  var pixelsPerInch = 300;
  var pixelsPerBead = 28;
  var sizesByInch = [
    {inches: 6.5, description: 'Extra Small'},
    {inches: 7, description: 'Small'},
    {inches: 8, description: 'Medium'},
    {inches: 9, description: 'Large'},
    {inches: 9.5, description: 'Extra Large'}
  ];

  $scope.onFile = function(blob) {
    Cropper.encode((file = blob)).then(function(dataUrl) {
      $scope.dataUrl = dataUrl;
      $timeout(showCropper);  // wait for $digest to set image's src
    });
  };

  ctrl.cropper = {};
  ctrl.cropperProxy = 'ctrl.cropper.callMethod';

  ctrl.showEvent = 'show';
  var showCropper = function() { $scope.$broadcast(ctrl.showEvent); }

  ctrl.hideEvent = 'hide';
  var hideCropper = function() { $scope.$broadcast(ctrl.hideEvent); }

  ctrl.options = {
    aspectRatio: 2 / 1,
    crop: function(dataNew) {
      data = dataNew;
    }
  };

  ctrl.sizeOptions = sizesByInch.map(function(size) {
    var pixelHeight = (Math.floor((pixelsPerInch * size.inches) / pixelsPerBead) * pixelsPerBead) + (pixelsPerBead / 2)
    return {value: pixelHeight, description: size.description + '(' + size.inches + ' inches)'}
  });
  ctrl.selectedSize = ctrl.sizeOptions[0].value;

  ctrl.selectSize = function() {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('setAspectRatio', braceletPixelWidth / ctrl.selectedSize);
  };

  ctrl.preview = function() {
    if (!file || !data) return;
    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
      (ctrl.preview || (ctrl.preview = {})).dataUrl = dataUrl;
    });
  };

  ctrl.clear = function(degrees) {
    if (!ctrl.cropper.callMethod) return;
    ctrl.cropper.callMethod('clear');
  };

  ctrl.scale = function(width) {
    Cropper.crop(file, data)
      .then(function(blob) {
        return Cropper.scale(blob, {width: width});
      })
      .then(Cropper.encode).then(function(dataUrl) {
        (ctrl.preview || (ctrl.preview = {})).dataUrl = dataUrl;
      });
  };
}]);