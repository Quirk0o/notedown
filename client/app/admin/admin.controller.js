'use strict';

export default class AdminController {
  constructor(User) {
    'ngInject';
    // Use the User $resource to fetch all users
    this.users = User.query();
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
