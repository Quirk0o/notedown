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
    note.author = this.Auth.getCurrentUser()._id;

    let oldNotes = this.notes;
    this.notes = oldNotes.concat([note]);

    this.Note.save(note).$promise
      .then(data => this.notes.filter((elem) => elem !== note))
      .catch(err => this.notes = oldNotes);
    this.note = '';
  }
}
