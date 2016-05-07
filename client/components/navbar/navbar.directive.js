'use strict';

import angular from 'angular';
import NavbarController from './navbar.controller';

function navbar() {
  return {
    template: require('./navbar.html'),
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  };
}

export default angular.module('notedownApp.directives.navbar', [])
  .directive('navbar', navbar)
  .controller('NavbarController', NavbarController)
  .name;
