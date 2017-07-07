'use strict';

angular.module('app').directive('pixelizer', ['CropImageService', pixelizer]);

function pixelizer(CropImageService) {
  return {
    restrict: 'A',
    scope: {
      url: '<pixelizerUrl',
      height: '<pixelizerHeight',
      width: '<pixelizerWidth',
      rows: '<pixelizerRows',
      columns: '<pixelizerColumns',
      palette: '<pixelizerPalette'
    },
    link: function(scope, element, attrs) {
      paper.install(scope);
      paper.setup(attrs.id);

      var columns = parseInt(scope.columns);
      var rows = parseInt(scope.rows);

      var raster = new paper.Raster(scope.url);
      raster.visible = false;

      raster.fitBounds(paper.view.bounds, true);

      var pixelWidth = parseInt(scope.width / columns) + 1;
      var pixelHeight = parseInt(scope.height / rows) + 1;

      raster.on('load', function() {
        for (var y = 0; y < rows; y++) {
          for(var x = 0; x < columns; x++) {
            var point = new paper.Point(x * pixelWidth, y * pixelHeight);
            var path = new paper.Path.Rectangle(point, new paper.Size(pixelWidth, pixelHeight));
            var color = CropImageService.bestColorOption(scope.palette, raster.getPixel(point));

            path.fillColor = new paper.Color(color[0], color[1], color[2]);
          }
        }

        paper.project.activeLayer.position = paper.view.center;
      });
    }
  };
}