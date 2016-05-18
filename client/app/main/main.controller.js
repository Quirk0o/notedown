'use strict';

export default class MainController {

  constructor($http, $scope, Auth, socket, Note) {
    this.$http = $http;
    this.Auth = Auth;
    this.Note = Note;
    this.awesomeThings = [];
    this.notes = Note.query();

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }

  submitNote(note) {
    console.log('Saving note ', note);
    this.Note.save({
      title: 'A Note',
      content: note,
      author: this.Auth.getCurrentUser()._id
    });
    this.notes = this.Note.query();
  }
}
