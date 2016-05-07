'use strict';

export default function NoteResource($resource) {
  return $resource('/api/notes/:id/:controller', {
    id: '@_id'
  });
}
