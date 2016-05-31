'use strict';

import './footer.scss';

function footer() {
  return {
    template: require('./footer.html'),
    restrict: 'E',
    link: function(scope, element) {
      element.addClass('footer');
    }
  };
}

export default angular.module('notedownApp.directives.footer', [])
  .directive('footer', footer)
  .name;
