'use strict';

describe('Controller: EditorController', function () {

  // load the controller's module
  beforeEach(module('notedownApp'));

  var EditorController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorController = $controller('EditorController', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    (1).should.equal(1);
  });
});
