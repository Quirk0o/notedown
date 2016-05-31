
import angular from 'angular';

import layout from './layout/layout.module';
import oauthButtons from './oauth-buttons/oauth-buttons.directive';
import mongooseError from './mongoose-error/mongoose-error.directive';
import socket from './socket/socket.service';
import mathjax from './mathjax/mathjax.directive';

export default angular.module('notedownApp.directives', [
  layout,
  oauthButtons,
  mongooseError,
  socket,
  mathjax
]).name;
