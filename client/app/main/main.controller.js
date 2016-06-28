'use strict';

import angular from 'angular'

export default class MainController {
  constructor($scope, $timeout, Auth, socket, Note, Drive) {
    'ngInject';
    this.$timeout = $timeout;
    this.Auth = Auth;
    this.Note = Note;
    this.Drive = Drive;
    this.notes = [];
    this.displayedNotes = [];
    this.dirty = false;

    this._fetchNotes()
        .then(() => {
          socket.syncUpdates('note', this.notes, (event, item) => {
            if (event === 'created' || event === 'updated') {
              this._populateChildren(item);
            }
            if (this.note && item._id === this.note._id) {
              this.note = item;
            }
          });
        });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('note');
    });

    $scope.$watch(
        () => this.note,
        (newVal, oldVal) => {
          this.dirty = true;
          this.debounceSave.bind(newVal, oldVal);
        },
        true
    );

    $scope.$watch(
        () => this.note,
        () => this.dirty = false,
        false
    );

    $scope.$watch(
        () => this.notes.filter(elem => !elem.parent).sort((a, b) => a.seq - b.seq),
        notes => this.displayedNotes = notes,
        true
    );
  }

  _fetchNotes() {
    return this.Note.query().$promise
        .then(data => {
          this.notes = data;
          this.notes.forEach(note => this._populateChildren(note));
          return data;
        });
  }

  _populateChildren(note) {
    note.children = note.children.map(childId => this.notes.find(elem => elem._id === childId));
  }

  _restoreNote(note) {
    let newNote = angular.copy(note);
    newNote.children = newNote.children.map(child => child._id);
    return newNote;
  }

  _findParent(note) {
    return this.notes.find(elem => elem._id === note.parent);
  }

  saveNote(note) {
    this.$timeout.cancel(this.timeout);

    if (this.dirty) {

      return this.Note.update({ id: note._id }, this._restoreNote(note)).$promise
          .then(note => {
            this.dirty = false;
            return note;
          });
    } else {
      return Promise.resolve();
    }
  }

  debounceSave(newValue, oldValue) {
    if (!angular.equals(newValue, oldValue)) {
      if (this.timeout) {
        this.$timeout.cancel(this.timeout);
      }
      this.timeout = this.$timeout(() => {
        this.saveNote(newValue)
            .then(data => {
              this.note = data;
              if (!this.notes.find(elem => elem._id === data._id)) {
                this.notes.push(data);
              }

              if (data.fileId) {
                return this.Drive.update({ id: data.fileId }).$promise;
              }
            })
            .catch(() => this.debounceSave(newValue));
      }, 5000);  // 1000 = 1 second
    }
  }

  handleNoteSelection(note) {
    if (this.note) {
      this.saveNote(this.note)
          .then(() => this.notes.find(elem => elem._id === note._id))
          .then(note => this.note = note)
          .catch(err => console.log('Failed to save note - aborting', err));
    } else {
      this.note = this.notes.find(elem => elem._id === note._id);
    }
  }

  handleNoteDelete(note) {
    let oldNotes = angular.copy(this.notes);
    this.notes = this.notes.filter(elem => elem._id !== note._id);

    if (note.parent) {
      let parent = this._findParent(note);
      parent.children = parent.children.filter(child => child._id !== note._id);

      this.Note.update({ id: parent._id }, this._restoreNote(note.parent)).$promise
          .then(() => this.Note.delete({ id: note._id }).$promise)
          .catch(() => this.notes = oldNotes);
    } else {
      this.Note.delete({ id: note._id }).$promise
          .catch(() => this.notes = oldNotes);
    }
  }

  _createNote(parent) {
    let note;
    return new Promise((resolve, reject) => {
      this.Note.create({ author: this.Auth.getCurrentUser()._id, parent: parent ? parent._id : null }).$promise
          .then(data => {
            note = data;
            if (parent) {
              parent.children.push(data);
              return this.Note.update({ id: parent._id }, this._restoreNote(parent)).$promise;
            }
            return Promise.resolve();
          })
          .then(() => this.Drive.save(note).$promise)
          .then(response => {
            if (response.fileId) {
              note.fileId = response.fileId;
              return this.Note.update({ id: note._id }, note).$promise;
            }
            return Promise.resolve();
          })
          .then(() => resolve(note))
          .catch(err => reject(err));
    });
  }

  handleNoteCreate(parent) {
    if (this.note) {
      this.saveNote(this.note)
          .then(() => this._createNote(parent))
          .then(note => this.note = this.notes.find(elem => elem._id === note._id) || note)
          .catch(err => console.log('Failed to create note', err));
    } else {
      this._createNote(parent)
          .then(note => this.note = this.notes.find(elem => elem._id === note._id) || note)
          .catch(err => console.log('Failed to create note', err));
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

  handleSearch(value) {
    let list = this.notes.slice();
    this.notes = [];
    list.forEach(note => {
      if (note.tags.includes(value)) {
        this.notes.push(note);
        note.collapsed = true;
        note.children = [];
      }
    });
  }

  handleShowAll() {
    this._fetchNotes();
  }

  handleChange(notes) {
    notes.forEach(note => {
      this.Note.update({ id: note._id }, this._restoreNote(note));
    });
  }
}
