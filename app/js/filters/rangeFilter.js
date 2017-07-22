'use strict';

angular.module('app').filter('range', [rangeFilter]);

function rangeFilter() {
  return function(input, min, max, step=1) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<max; i+=step)
      input.push(i);
    return input;
  };
}