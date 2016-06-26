export default class TreeController {
  constructor($scope) {
    'ngInject';
    this.nodes = [];
    this.activeNote = this.activeNote || {};
    $scope.$watch(() => this.notes, notes => {
      notes.forEach(note => {
        let node = this.nodes.find(elem => elem._id == note._id);
        if (node) {
          note.collapsed = node.collapsed;
        } else if (typeof note.collapsed === 'undefined') {
          note.collapsed = note._id !== this.activeNote._id || note.children.find(elem => elem._id === this.activeNote._id);
        }
      });
      this.nodes = notes;
    }, true);
  }

  handleClick(node) {
    node.collapsed = !node.collapsed;
    this.onSelect({ note: node });
  }
  
  handleCreate(parent) {
    if (parent) {
      parent.collapsed = false;
    }
    this.onCreate({ parent: parent });
  }
}
