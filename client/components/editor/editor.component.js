'use strict';

import EditorController from './editor.controller';

import './editor.scss';

export default {
  template: require('./editor.html'),
  controller: EditorController,
  bindings: {
    note: '=',
    onSubmit: '&'
  }
};
