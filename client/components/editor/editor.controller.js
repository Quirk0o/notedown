'use strict';

export default class EditorController {
  constructor() {
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
