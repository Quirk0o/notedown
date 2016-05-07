'use strict';

import angular from 'angular';
import OauthButtonsController from './oauth-buttons.controller';
import './oauth-buttons.scss';

function oauthButtons() {
  return {
    template: require('./oauth-buttons.html'),
    restrict: 'EA',
    controller: 'OauthButtonsController',
    controllerAs: 'OauthButtons',
    scope: {
      classes: '@'
    }
  };
}

export default angular.module('notedownApp.directives.oauth-buttons', [])
  .controller('OauthButtonsController', OauthButtonsController)
  .directive('oauthButtons', oauthButtons)
  .name;
