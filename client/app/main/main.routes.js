'use strict';

export default function ($stateProvider) {
  $stateProvider
    .state('main', {
      url: '/',
      template: require('./main.html'),
      controller: 'MainController',
      controllerAs: 'main'
    });
}
