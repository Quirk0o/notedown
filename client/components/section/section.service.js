'use strict';

import angular from 'angular';

function SectionResource($resource) {
  'ngInject';
  return $resource('/api/sections/:id');
}

export default angular.module('notedownApp.section', [])
  .factory('Section', SectionResource)
  .name;
