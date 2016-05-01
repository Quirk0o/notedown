'use strict';

(function() {

  function NoteResource($resource) {
    return $resource('/api/notes/:id/:controller', {
      id: '@_id'
    });
  }

  angular.module('notedownApp')
      .factory('Note', NoteResource);
})();
