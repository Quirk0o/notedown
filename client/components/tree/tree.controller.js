
export default class TreeController {
  constructor($scope) {
    this.nodes = [];
    $scope.$watch('$ctrl.notes', notes => {
      this.nodes = notes;
    });
  }
}
