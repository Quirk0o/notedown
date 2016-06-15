
export default class TreeController {
  constructor($scope) {
    'ngInject';
    this.nodes = [];
    $scope.$watch(() => this.notes, notes => this.nodes = notes, true);
    $scope.$watch(() => this.nodes, nodes => this.onChange(nodes), true);
  }
}
