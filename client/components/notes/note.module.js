import angular from 'angular';

import NoteResource from './note.service';

export default angular.module('notedownApp.note', [])
  .factory('Note', NoteResource)
  .name;
