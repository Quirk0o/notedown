'use strict';

import $ from 'jquery';

const tagRegex = /(?:\s|^)(?:#)(\w*[A-Za-z_]+\w*)/gi;

export default class EditorController {

  constructor(marked, $sanitize) {
    'ngInject';
    this.marked = marked;
    this.$sanitize = $sanitize;
  }

  _getNoteTitle(content) {
    let html = this.$sanitize(this.marked(content));
    let title = $(html).filter('h1').first();
    if (!title) {
      return 'Untitled';
    }
    return title.text();
  }

  _getNoteTags(content) {
    let result, tags = [];
    while ((result = tagRegex.exec(content))) {
      tags.push(result[0]);
    }

    return tags;
  }

  submitNote(content) {
    this.onSubmit({
      note: {
        content,
        title: this._getNoteTitle(content),
        tags: this._getNoteTags(content)
      }
    });
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
