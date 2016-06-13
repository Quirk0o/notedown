
export default class TreeController {
  constructor($scope) {
    'ngInject';
    this.nodes = [];
    $scope.$watch('$ctrl.notes', notes => {
      this.nodes = notes;
    });
  }
}
