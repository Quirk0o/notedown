'use strict';

import angular from 'angular';

/**
 * Removes server error when user updates input
 */

function mongooseError() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      element.on('keydown', () => ngModel.$setValidity('mongoose', true));
    }
  };
}

export default angular.module('notedownApp.directives.mongoose-error', [])
  .directive('mongooseError', mongooseError)
  .name;
