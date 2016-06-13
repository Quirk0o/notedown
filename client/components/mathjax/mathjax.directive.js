'use strict';

import angular from 'angular';
import MathJax from 'mathjax';

MathJax.Hub.Config({
  extensions: ['tex2jax.js'],
  tex2jax: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  skipStartupTypeset: true
});
MathJax.Hub.Configured();

function mathjax() {
  return {
    restrict: 'A',
    controller: function ($scope, $element) {
      'ngInject';
      $scope.$watch(() => {
        return $element.text();
      }, () => {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, $element[0]]);
      });
    }
  };
}

export default angular.module('notedownApp.directives.mathjax', [])
  .directive('mathjax', mathjax)
  .name;
