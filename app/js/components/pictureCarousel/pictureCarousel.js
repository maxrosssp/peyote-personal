'use strict';

angular.module('app').directive('pictureCarousel', [pictureCarousel]);

function PictureCarouselCtrl() {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.images = [];
    ctrl.interval = (ctrl.picIntervalSeconds || 5) * 1000;

    for (var i = 0; i < ctrl.picCount; i++) {
      ctrl.images.push({
        url: ctrl.picPath + '/' + ctrl.picPrefix + (i + 1) + '.' + (ctrl.picFileType || 'png'),
        id: i
      });
    }
  };
}

function pictureCarousel() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      picPath: '@',
      picPrefix: '@',
      picCount: '@',
      picFileType: '@?',
      picIntervalSeconds: '@?'
    },
    controller: [
      PictureCarouselCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/pictureCarousel/pictureCarousel.html'
  };
}