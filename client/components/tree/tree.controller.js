export default class TreeController {
  constructor($scope) {
    'ngInject';
    this.nodes = [];
    $scope.$watch(() => this.notes, notes => {
      notes.forEach(note => {
        if (!this.nodes.find(elem => elem._id === note._id)) {
          this.nodes.push(note);
          note.collapsed = true;

          if (note.children.length > 0) {
            note.hasChildren = true;
          }
        }
      });

      this.nodes = this.nodes.filter(note => notes.find(elem => elem._id === note._id));
    }, true);

    $scope.$watch(
        () => this.activeNote,
        note => {
          if (note) {
            if (note._id) {
              if (note.parent) {
                Object.assign(this.nodes.find(elem => elem._id == note.parent)
                    .children
                    .find(elem => elem._id === note._id), note);
              } else {
                Object.assign(this.nodes.find(elem => elem._id === note._id), note);
              }
            } else {
              if (note.parent) {
                let parent = this.nodes.find(elem => elem._id === note.parent);
                parent.collapsed = false;
                if (!parent.children.find(elem => elem === note)) {
                  parent.children.push(note);
                }
              } else if (!this.nodes.find(elem => elem === note)) {
                this.nodes.push(note);
              }
            }
          }
        }, 
        true
    );
  }

  onClick(node) {
    if (node.collapsed) {
      this.onExpand({ note: node });
    } else {
      this.onCollapse({ note: node });
    }

    node.collapsed = !node.collapsed;
    this.onSelect({ note: node });
  }
}
