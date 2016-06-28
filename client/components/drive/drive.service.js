'use strict'

import angular from 'angular'

export default function DriveResource($resource) {
  'ngInject';
  return $resource('/drive/:id', null, {
    'update': { method: 'PUT' }
  });
}

export default angular.module('notedownApp.drive', [])
    .service('Drive', DriveResource)
    .name;