'use strict';

import angular from 'angular';
import uiTree from 'angular-ui-tree';
import uiBootstrap from 'angular-ui-bootstrap'

import Tree from './tree.component.js';

export default angular.module('notedownApp.components.tree', [ uiTree, uiBootstrap ])
  .component('tree', Tree)
  .name;
