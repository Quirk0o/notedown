
import TreeController from './tree.controller';

import 'angular-ui-tree/dist/angular-ui-tree.css';
import './tree.scss';

export default {
  template: require('./tree.html'),
  controller: TreeController,
  bindings: {
    notes: '<',
    onSelect: '&',
    onChange: '&',
    onDelete: '&',
    onCreate: '&'
  }
};
