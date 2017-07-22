'use strict';

angular.module('app').directive('orderReview', [orderReview]);

function OrderReviewCtrl($scope, $timeout, $colorThief, PEYOTE_VALUES) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.templatePrice = 20;
    ctrl.pricePerSquareInch = 1.5;
    ctrl.pricePerColor = 1;
    ctrl.priceForClasps = 3;
    ctrl.priceToShip = 5;
    ctrl.salesTax = 0.06;

    ctrl.templateSize = calculateTemplateSize();
    
    ctrl.updateFinalPrice();
  };

  var calculateTemplateSize = function() {
    var selectedHeight = PEYOTE_VALUES.heightOptions.find(function(option) {
      return option.beads === ctrl.beadHeight;
    });

    var selectedWidth = PEYOTE_VALUES.widthOptions.find(function(option) {
      return option.beads === ctrl.beadWidth;
    });

    var sizeInches = selectedHeight.inches + ' in. x ' + selectedWidth.inches + ' in.';
    var sizeBeads = parseInt(selectedHeight.beads) + ' x ' + selectedWidth.beads + ' beads';

    return {
      inches: {display: sizeInches, value: selectedHeight.inches * selectedWidth.inches},
      beads: {display: sizeBeads, value: parseInt(selectedHeight.beads) * selectedWidth.beads}
    };
  };

  var calculateSubtotal = function() {
    var price = ctrl.templatePrice;

    if (ctrl.includeBeads) {
      price += ctrl.pricePerSquareInch * ctrl.templateSize.inches.value;
      price += ctrl.pricePerColor * ctrl.colorCount;
    }

    if (ctrl.includeClasps) {
      price += ctrl.priceForClasps;
    }

    return price;
  };

  ctrl.mustShip = function() {
    return ctrl.includeBeads || ctrl.includeClasps;
  };

  ctrl.$onChanges = function(changesObj) {
    if (changesObj.beadHeight || changesObj.beadWidth) {
      ctrl.templateSize = calculateTemplateSize();
    }

    ctrl.updateFinalPrice();
  };

  ctrl.updateFinalPrice = function() {
    ctrl.subtotal = calculateSubtotal();

    var finalPrice = ctrl.subtotal * (1 + ctrl.salesTax);
    if (ctrl.mustShip()) {
      finalPrice += ctrl.priceToShip;
    }

    ctrl.finalPrice = finalPrice;
  };
}

function orderReview() {
  return {
    restrict: 'E',
    require: '^^finalizeModal',
    scope: {},
    bindToController: {
      beadHeight: '<',
      beadWidth: '<',
      colorCount: '<',
      finalPrice: '=',
      mustShip: '='
    },
    controller: [
      '$scope', '$timeout', '$colorThief', 'PEYOTE_VALUES', OrderReviewCtrl
    ],
    controllerAs: 'ctrl',
    templateUrl: 'js/components/orderReview/orderReview.html'
  };
}