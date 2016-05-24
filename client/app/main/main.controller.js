'use strict';

export default class MainController {
  constructor($scope, Auth, socket, Note) {
    this.Auth = Auth;
    this.Note = Note;
    this.note = '';

    Note.query().$promise
      .then(data => {
        this.notes = data;
        socket.syncUpdates('note', this.notes);
      });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('note');
    });
  }

  submitNote(note) {
    let oldNotes = this.notes;
    this.notes = oldNotes.concat([note]);
    
    this.Note.save({
      title: 'A Note',
      content: note,
      author: this.Auth.getCurrentUser()._id
    }).$promise
      .then(data => {
        this.notes = oldNotes.concat([data]);
      })
      .catch(error => {
        this.notes = oldNotes;
        console.err(error);
      });
    this.note = '';
  }
}
