'use strict';

import angular from 'angular';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import marked from 'angular-marked';

import Preview from './preview.component.js';

export default angular.module('notedownApp.components.preview', [ marked ])
  .component('preview', Preview)
  .config(function (markedProvider) {
    'ngInject';
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: false,
      smartLists: true,
      smartypants: true,
      highlight: function (code, lang) {
        if (lang) {
          return hljs.highlight(lang, code, true).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });
  })
  .name;
