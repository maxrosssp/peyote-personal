'use strict';

describe('app', function() {

  beforeEach(module('app'));

  describe('Directive: viewOne', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});