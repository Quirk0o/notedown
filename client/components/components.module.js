
import angular from 'angular';

import editor from './editor/editor';
import preview from './preview/preview';
import tree from './tree/tree';

export default angular.module('notedownApp.components', [
  editor,
  preview,
  tree
]).name;
