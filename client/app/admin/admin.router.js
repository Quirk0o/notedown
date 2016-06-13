'use strict';

export default function ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: require('./admin.html'),
      controller: 'AdminController',
      controllerAs: 'admin',
      authenticate: 'admin'
    });
}
