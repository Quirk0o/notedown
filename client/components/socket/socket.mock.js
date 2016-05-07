'use strict';

import angular from 'angular';

function socket() {
  return {
    socket: {
      connect: function () {},
      on: function () {},
      emit: function () {},
      receive: function () {}
    },
    syncUpdates: function () {},
    unsyncUpdates: function () {}
  };
}

export default angular.module('socketMock', [])
  .factory('socket', socket)
  .name;
