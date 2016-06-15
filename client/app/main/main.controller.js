'use strict';

export default class MainController {
  constructor($scope, $timeout, Auth, socket, Note, Drive) {
    'ngInject';
    this.$timeout = $timeout;
    this.Auth = Auth;
    this.Note = Note;
    this.Drive = Drive;
    this.notes = [];
    this.displayedNotes = [];

    Note.query().$promise
        .then(data => {
          this.notes = data;
          if (data.length > 0) {
            this.note = data[data.length - 1];
          }
          socket.syncUpdates('note', this.notes);
        });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('note');
    });

    $scope.$watch(
        () => this.note,
        this.debounceSave.bind(this),
        true);

    $scope.$watch(
        () => {
          if (this.note) {
            return this.note._id ? this.notes : this.notes.concat([this.note]);
          } else {
            return this.notes;
          }
        },
        notes => this.displayedNotes = notes,
        true);
  }

  saveNote(note) {
    this.$timeout.cancel(this.timeout);

    note.author = this.Auth.getCurrentUser()._id;

    if (note._id) {
      return this.Note.update({ id: note._id }, note).$promise;
    } else {

      this.Drive.save(note).$promise
          .then(() => console.log('Saved to drive'))
          .catch((err) => console.log('Failed to save to drive', err));

      return this.Note.save(note).$promise;
    }
  }

  debounceSave(value) {
    if (value) {
      if (this.timeout) {
        this.$timeout.cancel(this.timeout);
      }
      this.timeout = this.$timeout(() => {
        this.saveNote(value)
            .then(data => {
              this.note = data;
              if (!this.notes.find(elem =>  elem._id === data._id)) {
                this.notes.push(data);
              }
            })
            .catch(() => this.debounceSave(value));
      }, 5000);  // 1000 = 1 second
    }
  }

  handleNoteSelection(note) {
    if (note._id) {
      if (this.note) {
        this.saveNote(this.note)
            .then(() => {
              this.note = this.notes.find(elem => elem._id === note._id);
            })
            .catch(() => console.log('Failed to save note - aborting'));
      } else {
        this.note = this.notes.find(elem => elem._id === note._id);
      }
    }
  }

  handleNoteDelete(note) {
    if (this.note === note) {
      this.note = null;
    }

    if (note._id) {
      let oldNotes = this.notes;
      this.notes = oldNotes.filter(elem => elem !== note);

      this.Note.delete({ id: note._id }).$promise
          .catch(() => this.notes = oldNotes);
    } else {
      this.notes = this.notes.filter(elem => elem !== note);
    }

    if (this.notes.length > 0) {
      this.note = this.notes[this.notes.length - 1];
    }
  }

  handleNoteCreate() {
    if (this.note) {
      this.saveNote(this.note)
          .then(() => this.note = { content: '', title: '', tags: [] })
          .catch(() => console.log('Failed to save note - aborting'));
    } else {
      this.note = { content: '', title: '', tags: [] };
    }
  }

  handleContentChange(value) {
    if (this.note) {
      this.note.content = value;
    }
  }

  handleTitleChange(value) {
    if (this.note) {
      this.note.title = value;
    }
  }

  handleTagsChange(value) {
    if (this.note) {
      this.note.tags = value;
    }
  }
}
