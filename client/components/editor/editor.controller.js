'use strict';

import $ from 'jquery';

const tagRegex = /(?:\s|^)(?:#)(\w*[A-Za-z_]+\w*)/gi;

export default class EditorController {

  constructor($scope, marked, $sanitize) {
    'ngInject';
    this.note = this.note || '';
    this.marked = marked;
    this.$sanitize = $sanitize;

    $scope.$watch(
        () => this.getNoteTitle(this.note),
        (title => this.onTitleChange({ title })));
    $scope.$watch(
        () => this.getNoteTags(this.note),
        tags => this.onTagsChange({ tags }),
        true);
    $scope.$watch(
        () => this.note, 
        content => this.onChange({ content }));

  }

  getNoteTitle(content) {
    if (content) {
      let html = this.$sanitize(this.marked(content));
      let title = $(html).filter('h1').first();

      if (!title) {
        return 'Untitled';
      }
      return title.text();
    }
  }

  getNoteTags(content) {
    let result, tags = [];
    while ((result = tagRegex.exec(content))) {
      tags.push(result[0]);
    }

    return tags;
  }

  aceLoaded(editor) {
    let session = editor.getSession();
    let renderer = editor.renderer;
    editor.setTheme('chrome');

    session.setUseWrapMode(true);
    session.setMode('markdown');

    renderer.setShowGutter(true);

    let count = session.getLength();
    editor.focus();
    editor.gotoLine(count, session.getLine(count - 1).length);
  }
}
