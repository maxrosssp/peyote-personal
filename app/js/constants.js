angular.module('app')

.constant('PEYOTE_VALUES', {
  braceletPixelWidth: 600,
  pixelsPerInch: 300,
  pixelsPerBead: 28,
  heightOptions: [
    {beads: 93.5, inches: 6.5, description: '6.5 in.'},
    {beads: 100.5, inches: 7, description: '7 in.'},
    {beads: 107.5, inches: 7.5, description: '7.5 in.'},
    {beads: 114.5, inches: 8, description: '8 in.'},
    {beads: 121.5, inches: 8.5, description: '8.5 in.'},
    {beads: 129.5, inches: 9, description: '9 in.'},
    {beads: 136.5, inches: 9.5, description: '9.5 in.'}
  ],
  widthOptions: [
    {beads: 24, inches: 1.2, description: 'Skinny (1.2 in.)'},
    {beads: 27, inches: 1.35, description: 'Normal (1.35 in.)'},
    {beads: 30, inches: 1.5, description: 'Wide (1.5 in.)'}
  ],
  beadHeight: 14,
  beadWidth: 10
})

.constant('STRIPE', {
  publishableKey: 'pk_test_8lpNNwFVokUif3qxk2N7fPd6'
})

.constant('PEYOTE_PRICES', {
  templatePrice: 20,
  pricePerSquareInch: 1.5,
  pricePerColor: 1,
  priceForClasps: 3,
  priceToShip: 5,
  salesTax: 0.06
});