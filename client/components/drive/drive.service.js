'use strict'

import angular from 'angular'

export default function DriveResource($resource) {
  'ngInject';
  return $resource('/drive', null);
}

export default angular.module('notedownApp.drive', [])
    .service('Drive', DriveResource)
    .name;