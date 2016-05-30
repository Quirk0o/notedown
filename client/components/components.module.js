
import angular from 'angular';

import editor from './editor/editor';
import preview from './preview/preview';

export default angular.module('notedownApp.components', [
  editor,
  preview
]).name;
