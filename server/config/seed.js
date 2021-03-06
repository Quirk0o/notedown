/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Note from '../api/note/note.model';

Thing.find({}).removeAsync()
    .then(() => {
      Thing.create({
        name: 'Development Tools',
        info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
              'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
              'Stylus, Sass, and Less.'
      }, {
        name: 'Server and Client integration',
        info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
              'AngularJS, and Node.'
      }, {
        name: 'Smart Build System',
        info: 'Build system ignores `spec` files, allowing you to keep ' +
              'tests alongside code. Automatic injection of scripts and ' +
              'styles into your index.html'
      }, {
        name: 'Modular Structure',
        info: 'Best practice client and server structures allow for more ' +
              'code reusability and maximum scalability'
      }, {
        name: 'Optimized Build',
        info: 'Build process packs up your templates as a single JavaScript ' +
              'payload, minifies your scripts/css/images, and rewrites asset ' +
              'names for caching.'
      }, {
        name: 'Deployment Ready',
        info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
              'and openshift subgenerators'
      });
    });

User.find({}).removeAsync()
    .then(() => User.createAsync({
      provider: 'local',
      name:     'Test User',
      email:    'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role:     'admin',
      name:     'Admin',
      email:    'admin@example.com',
      password: 'admin'
    }))
    .then(() => {
      console.log('finished populating users');
      return User.findOneAsync({ name: 'Test User' })
    })
    .then(user => {
      Note.removeAsync()
          .then(() => Note.createAsync({
            title:   'title',
            content: '# title\ncontent\n#tag',
            tags:    ['tag'],
            author:  user._id,
            index:   1
          }))
          .then(parent => {
            var child = new Note({
              title:   'child title',
              content: '# child title\nchild content',
              author:  user._id,
              parent:  parent._id
            });

            child.saveAsync()
                .then(() => {
                  parent.children.push(child._id);
                  parent.saveAsync();

                  return Note.createAsync({
                    title:   'another title',
                    content: '# another title\nmore content',
                    author:  user._id,
                    index:   0
                  });
                })
                .then(() =>
                    console.log('finished populating notes')
                )
          });
    });