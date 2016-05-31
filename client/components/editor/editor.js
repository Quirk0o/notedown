'use strict';

import angular from 'angular';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/chrome';
import 'brace/ext/language_tools';
import uiAce from 'exports?"ui.ace"!angular-ui-ace';

import Editor from './editor.component.js';

export default angular.module('notedownApp.components.editor', [ uiAce ])
  .component('editor', Editor)
  .name;
