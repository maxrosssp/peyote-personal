'use strict';

angular.module('app').directive('pixelizer', ['CropImageService', pixelizer]);

function PixelizerCtrl(CropImageService) {
  var ctrl = this;

  ctrl.$onInit = function() {
  
  };

  ctrl.$onChanges = function(changesObject) {

  };
}

function pixelizer() {
  return {
    restrict: 'E',
    require: '^^finalizeModal',
    scope: {
      pixelizeId: '<'
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$on('pixelize-' + scope.pixelizeId, function(event, url, data, palette) {
        attrs.height = data.height;
        attrs.width = data.width;

        paper.setup(scope.pixelizeId);

        var raster = new paper.Raster(url);

        raster.on('load', function() {
          raster.fitBounds(paper.view.bounds, true);

          var columns = parseInt(data.columns);
          var rows = parseInt(data.rows);
          var pixelWidth = data.width / columns;
          var pixelHeight = data.height / rows;

          raster.size = new paper.Size(columns, rows);

          for (var y = 0; y < rows; y++) {
            for(var x = 0; x < columns; x++) {
              var pxColor = raster.getPixel(new paper.Point(x, y));

              var path = new paper.Path.Rectangle(new paper.Point(x * pixelWidth, y * pixelHeight), new paper.Size(pixelWidth, pixelHeight));

              var bestMatch = CropImageService.bestColorOption(scope.palette, [pxColor.red * 256, pxColor.green * 256, pxColor.blue * 256]);

              path.fillColor = new paper.Color(bestMatch[0] / 256, bestMatch[1] / 256, bestMatch[2] / 256);
            }
          }
        });

        paper.project.activeLayer.position = paper.view.center;
      });
    },
    template: '<canvas id="{{pixelizeId}}"></canvas>'
  };
}