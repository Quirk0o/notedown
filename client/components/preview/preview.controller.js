'use strict';

export default class PreviewController {
  constructor($scope, marked) {
    'ngInject';
    $scope.$watch(
        () => this.note,
        note => { if (note) this.markdown = marked(note) });
  }
}
