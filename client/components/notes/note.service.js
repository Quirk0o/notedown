'use strict';

export default function NoteResource($resource) {
  'ngInject';
  return $resource('/api/notes/:id', null, {
    'update': { method:'PUT' }
  });
}
