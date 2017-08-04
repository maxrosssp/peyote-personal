'use strict';

angular.module('app').factory('OrderReviewService', [
  'PEYOTE_VALUES', 'PEYOTE_PRICES', OrderReviewService
]);

function OrderReviewService(PEYOTE_VALUES, PEYOTE_PRICES) {
  var calculateTemplateSize = function(beadHeight, beadWidth) {
    var selectedHeight = PEYOTE_VALUES.heightOptions.find(function(option) {
      return option.beads === beadHeight;
    }) || {};

    var selectedWidth = PEYOTE_VALUES.widthOptions.find(function(option) {
      return option.beads === beadWidth;
    }) || {};

    var sizeInches = selectedHeight.inches + ' in. x ' + selectedWidth.inches + ' in.';
    var sizeBeads = parseInt(selectedHeight.beads) + ' x ' + selectedWidth.beads + ' beads';

    return {
      inches: {display: sizeInches, value: selectedHeight.inches * selectedWidth.inches},
      beads: {display: sizeBeads, value: parseInt(selectedHeight.beads) * selectedWidth.beads}
    };
  }

	var calculateSubtotal = function(options) {
    var price = PEYOTE_PRICES.templatePrice;

    if (options.includeBeads && options.templateSize) {
      price += PEYOTE_PRICES.pricePerSquareInch * options.templateSize.inches.value;
      price += PEYOTE_PRICES.pricePerColor * (options.colorCount - 12);
    }

    if (options.includeClasps) {
      price += PEYOTE_PRICES.priceForClasps;
    }

    return price;
  };

  var shippingAndTaxCost = function(subtotal, mustShip) {
    var tax = subtotal * PEYOTE_PRICES.salesTax;

    return tax + (mustShip ? PEYOTE_PRICES.priceToShip : 0);
  };

	return {
		calculateTemplateSize: calculateTemplateSize,
    calculateSubtotal: calculateSubtotal,
    shippingAndTaxCost: shippingAndTaxCost
	};
}