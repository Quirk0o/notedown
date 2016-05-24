
import angular from 'angular';

import navbar from './navbar/navbar.directive';
import footer from './footer/footer.directive';
import oauthButtons from './oauth-buttons/oauth-buttons.directive';
import mongooseError from './mongoose-error/mongoose-error.directive';
import socket from './socket/socket.service';
import mathjax from './mathjax/mathjax.directive';

export default angular.module('notedownApp.directives', [
  navbar,
  footer,
  oauthButtons,
  mongooseError,
  socket,
  mathjax
]).name;
