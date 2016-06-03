'use strict';

export default class MainController {
  constructor($scope, Auth, socket, Note) {
    this.Auth = Auth;
    this.Note = Note;
    this.notes = [];
    this.note = { content: '', title: '', tags: [] };

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

    if (this.note._id) {
      this.Note.update({ id: this.note._id }, note).$promise
        .then(data => {
          this.note = data;
          this.notes = this.notes.map(elem => {
            if (elem._id === data._id) return data;
            else return elem;
          })
        });
    } else {

      let oldNotes = this.notes;
      this.notes = oldNotes.concat([note]);

      this.Note.save(note).$promise
        .then(data => {
          this.note = data;
          this.notes = oldNotes.concat([data])
        })
        .catch(() => this.notes = oldNotes);
    }
  }

  handleNoteSelection(note) {
    this.Note.get({id: note._id}).$promise
      .then(data => this.note = data);
  }

  handleNoteDelete(note) {
    let oldNotes = this.notes;
    this.notes = oldNotes.filter(elem => elem !== note);

    this.Note.delete({id: note._id}).$promise
      .catch(() => this.notes = oldNotes);
  }
}
