'use strict';

import angular from 'angular';
import uiTree from 'angular-ui-tree';

import Tree from './tree.component.js';

export default angular.module('notedownApp.components.tree', [ uiTree ])
  .component('tree', Tree)
  .name;
