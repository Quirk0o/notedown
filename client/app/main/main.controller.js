'use strict';

import angular from 'angular'

export default class MainController {
  constructor($scope, $timeout, Auth, socket, Note, Drive) {
    'ngInject';
    this.$timeout = $timeout;
    this.Auth = Auth;
    this.Note = Note;
    this.Drive = Drive;
    let notes = [];
    this.notes = [];
    this.displayedNotes = [];

    Note.query().$promise
        .then(data => {
          notes = data;
          socket.syncUpdates('note', notes)
        });

    $scope.$watch(
        () => notes,
        notes => {
          this.notes = notes.filter(note => !note.parent);
        },
        true
    );

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('note');
    });

    $scope.$watch(
        () => this.note,
        this.debounceSave.bind(this),
        true
    );

    $scope.$watch(
        () => this.notes,
        notes => this.displayedNotes = angular.copy(notes),
        true
    );
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

  debounceSave(newValue, oldValue) {
    if (!angular.equals(newValue, oldValue)) {
      if (this.timeout) {
        this.$timeout.cancel(this.timeout);
      }
      this.timeout = this.$timeout(() => {
        this.saveNote(value)
            .then(data => {
              this.note = data;
              if (!this.notes.find(elem => elem._id === data._id)) {
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
              if (note.parent) {
                return this.Note.get({ id: note._id }).$promise;
              }
              else {
                return this.notes.find(elem => elem._id === note._id);
              }
            })
            .then(note => this.note = note)
            .catch(err => console.log('Failed to save note - aborting', err));
      } else {
        let list = this.notes.slice();
        for (let i = 0; i < list.length; i++) {
          if (list[i]._id == note._id) {
            this.note = list[i];
            return;
          }
          list[i].children.forEach(child => list.push(this.Note.get({ id: child })));
        }
      }
    }
  }

  handleNoteDelete(note) {
    if (this.note === note) {
      this.note = null;
    }

    if (note._id) {
      let oldNotes = angular.copy(this.notes);

      if (note.parent) {
        let parent = this.notes.find(elem => elem._id === note.parent);
        parent.children
            .filter(child => child._id !== note._id);
        console.log(parent);

        this.Note.update({ id: parent._id }, parent).$promise
            .then(() => {
              return this.Note.delete({ id: note._id }).$promise;
            })
            .catch(() => this.notes = oldNotes);
      } else {
        this.notes = this.notes.filter(elem => elem._id !== note._id);

        console.log(this.notes);

        this.Note.delete({ id: note._id }).$promise
            .catch(() => this.notes = oldNotes);
      }
    }
  }

  handleNoteCreate(parent) {
    if (this.note) {
      this.saveNote(this.note)
          .then(() => this.note = { content: '', title: '', tags: [], parent: parent ? parent._id : null })
          .catch(() => console.log('Failed to save note - aborting', err));
    } else {
      this.note = { content: '', title: '', tags: [], parent: parent ? parent._id : null };
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

  handleNoteExpand(note) {
    note = this.notes.find(elem => elem._id === note._id);
    if (note.children.length > 0 && !note.children[0].title) {
      note.children = note.children.map(id => this.Note.get({ id }));
    }
  }

  handleNoteCollapse(note) {

  }

  handleSearch(value) {
    let list = this.notes.slice();
    this.notes = [];
    list.forEach(note => {
      if (note.tags.includes(value)) {
        this.notes.push(note);
      }
      note.children.forEach(child => list.push(this.Note.get({ id: child })));
    });
  }

  handleShowAll() {
    this.Note.query().$promise
        .then(data => {
          this.notes = data;
        });
  }
}
