import angular from 'angular';

import modal from './modal/modal.service';

export default angular.module('notedownApp.services', [])
  .factory('Modal', modal)
  .name;
