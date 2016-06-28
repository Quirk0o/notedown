export default class TreeController {
  constructor($scope) {
    'ngInject';
    this.nodes = [];
    this.activeNote = this.activeNote || {};
    $scope.$watch(() => this.notes, notes => {
      notes.forEach(note => {
        let node = this.nodes.find(elem => elem._id === note._id);
        if (node) {
          note.collapsed = node.collapsed;
        } else if (typeof note.collapsed === 'undefined') {
          note.collapsed = note._id !== this.activeNote._id || note.children.find(
                  elem => elem._id === this.activeNote._id);
        }
      });

      this.nodes = notes;
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].seq = i;
        for (let k = 0; k < this.nodes[i].children.length; k++) {
          this.nodes[i].children[k].seq = k;
        }
      }
    }, true);

    this.treeOptions = {
      dropped: this.handleDropped.bind(this)
    };
  }

  handleDropped(event) {
    let node = event.source.nodeScope.node;
    node.seq = event.dest.index;
    this.onChange({ notes: this.nodes });
  }

  handleClick(node) {
    if (node.children.length > 0) {
      node.collapsed = !node.collapsed;
      this.onChange({ notes: [node] });
    }
    this.onSelect({ note: node });
  }

  handleCreate(parent) {
    if (parent) {
      parent.collapsed = false;
    }
    this.onCreate({ parent: parent });
  }
}
