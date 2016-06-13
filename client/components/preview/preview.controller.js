'use strict';

export default class PreviewController {
  constructor(marked) {
    'ngInject';
    this.marked = marked;
  }

  markdown() {
    return this.marked(this.note);
  }
}
