'use strict';

import angular from 'angular';

function SectionResource($resource) {
  return $resource('/api/sections/:id');
}

export default angular.module('notedownApp.section', [])
  .factory('Section', SectionResource)
  .name;
