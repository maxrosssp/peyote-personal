'use strict';

angular.module('app').directive('pixelizer', [
  'ngProgressFactory', 'CropImageService', pixelizer
]);

function pixelizer(ngProgressFactory, CropImageService) {
  return {
    restrict: 'E',
    require: '^^finalizeModal',
    scope: {
      pixelizeId: '@',
      height: '<',
      width: '@'
    },
    link: function(scope, element, attrs, ctrl) {
      scope.progressbar = ngProgressFactory.createInstance();
      scope.progressbar.setParent(angular.element(element).children()[0]);

      scope.$on('pixelize-' + scope.pixelizeId, function(event, url, data, palette) {
        scope.showPixelizedImage = false;

        scope.progressbar.start();

        paper.setup(scope.pixelizeId);

        var raster = new paper.Raster(url);

        raster.on('load', function() {
          raster.fitBounds(paper.view.bounds, true);

          var columns = parseInt(data.columns);
          var rows = parseInt(data.rows);
          var pixelWidth = scope.width / columns;
          var pixelHeight = scope.height / rows;

          raster.size = new paper.Size(columns, rows);

          for (var y = 0; y < rows; y++) {
            for(var x = 0; x < columns; x++) {
              var pxColor = raster.getPixel(new paper.Point(x, y));

              var path = new paper.Path.Rectangle(new paper.Point(x * pixelWidth, y * pixelHeight), new paper.Size(pixelWidth, pixelHeight));

              var bestMatch = CropImageService.bestColorOption(palette, [pxColor.red * 256, pxColor.green * 256, pxColor.blue * 256]);

              path.fillColor = new paper.Color(bestMatch[0] / 256, bestMatch[1] / 256, bestMatch[2] / 256);
            }

            scope.progressbar.set((y / rows) * 100);
          }

          scope.progressbar.complete();

          scope.showPixelizedImage = true;
        });

        paper.project.activeLayer.position = paper.view.center;
      });
    },
    template: '<div id="{{pixelizeId}}-progress"><canvas ng-show="showPixelizedImage" id="{{pixelizeId}}" height="{{height}}" width="{{width}}" ' +
                'class="pixelizer ' +
                '"></canvas></div>'
  };
}