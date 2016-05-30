'use strict';

import PreviewController from './preview.controller';

import './preview.scss';

export default {
  template: require('./preview.html'),
  controller: PreviewController,
  bindings: {
    note: '<'
  }
};
