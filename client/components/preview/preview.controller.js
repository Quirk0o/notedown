'use strict';

export default class PreviewController {
  constructor(marked) {
    this.marked = marked;
  }

  markdown() {
    return this.marked(this.note);
  }
}
