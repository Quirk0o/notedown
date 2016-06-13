// Generated on 2016-05-01 using generator-angular-fullstack 3.3.0
'use strict';

let gulp = require('gulp');
let gulpLoadPlugins = require('gulp-load-plugins');

let _ = require('lodash');
let del = require('del');
let path = require('path');
let http = require('http');
let open = require('open');

let lazypipe = require('lazypipe');
let runSequence = require('run-sequence');
let webpack = require('webpack-stream');
let protractor = require('gulp-protractor').protractor;
let webdriver_update = require('gulp-protractor').webdriver_update
let Instrumenter = require('isparta');

let nodemon = require('nodemon');
let KarmaServer = require('karma');

let webpackConf = require('./webpack.conf');

var plugins = gulpLoadPlugins();
var config;

const clientPath = 'client';
const serverPath = 'server';
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    scripts: [
      `${clientPath}/**/!(*.spec|*.mock).js`,
      `!${clientPath}/bower_components/**/*`
    ],
    entryPoint: `${clientPath}/app/app.js`,
    styles: [`${clientPath}/{app,components}/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/{app,components}/**/*.html`,
    mainView: `index.html`,
    test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js']
  },
  server: {
    scripts: [`${serverPath}/**/!(*.spec|*.integration).js`],
    json: [`${serverPath}/**/*.json`],
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
    }
  },
  karma: 'karma.conf.js',
  dist: 'dist'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message);
}

function checkAppReady(cb) {
  var options = {
    host: 'localhost',
    port: config.port
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
  var serverReady = false;
  var appReadyInterval = setInterval(() =>
      checkAppReady((ready) => {
        if (!ready || serverReady) {
          return;
        }
        clearInterval(appReadyInterval);
        serverReady = true;
        cb();
      }),
    100);
}

function sortModulesFirst(a, b) {
  var module = /\.module\.js$/;
  var aMod = module.test(a.path);
  var bMod = module.test(b.path);
  // inject *.module.js first
  if (aMod === bMod) {
    // either both modules or both non-modules, so just sort normally
    if (a.path < b.path) {
      return -1;
    }
    if (a.path > b.path) {
      return 1;
    }
    return 0;
  } else {
    return (aMod ? -1 : 1);
  }
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()
  .pipe(plugins.jshint, `${clientPath}/.jshintrc`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerScripts = lazypipe()
  .pipe(plugins.jshint, `${serverPath}/.jshintrc`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerTestScripts = lazypipe()
  .pipe(plugins.jshint, `${serverPath}/.jshintrc-spec`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel)
  .pipe(plugins.sourcemaps.write, '.');

let mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: [
      './mocha.conf'
    ]
  });

let istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: './coverage',
    rootDirectory: ''
  });

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require(`./${serverPath}/config/local.env`);
  } catch (e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});
gulp.task('env:test', () => {
  plugins.env({
    vars: {NODE_ENV: 'test'}
  });
});
gulp.task('env:prod', () => {
  plugins.env({
    vars: {NODE_ENV: 'production'}
  });
});

/********************
 * Tasks
 ********************/

gulp.task('webpack', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  return gulp.src(paths.client.entryPoint)
    .pipe(webpack(webpackConf[process.env.NODE_ENV]))
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('transpile:server', () => {
  return gulp.src(_.union(paths.server.scripts, paths.server.json))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
  return gulp.src(_.union(
    paths.client.scripts,
    _.map(paths.client.test, blob => '!' + blob),
    [`!${clientPath}/app/app.constant.js`]
    ))
    .pipe(lintClientScripts());
});

gulp.task('lint:scripts:server', () => {
  return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
    .pipe(lintServerScripts());
});

gulp.task('lint:scripts:clientTest', () => {
  return gulp.src(paths.client.test)
    .pipe(lintClientScripts());
});

gulp.task('lint:scripts:serverTest', () => {
  return gulp.src(paths.server.test)
    .pipe(lintServerTestScripts());
});

gulp.task('jscs', () => {
  return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter());
});

gulp.task('start:client', cb => {
  whenServerReady(() => {
    open('http://localhost:' + config.port);
    cb();
  });
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/${serverPath}/config/environment`);
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} ${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('watch', () => {
  var testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

  plugins.livereload.listen();

  plugins.watch(paths.client.styles, () => {
    gulp.src(paths.client.entryPoint)
      .pipe(plugins.plumber())
      .pipe(webpack(webpackConf.development))
      .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
      .pipe(plugins.livereload());
  });

  plugins.watch(paths.client.views, () => {
    gulp.src(paths.client.entryPoint)
      .pipe(plugins.plumber())
      .pipe(webpack(webpackConf.development))
      .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
      .pipe(plugins.livereload());
  });
  
  plugins.watch(paths.client.scripts)
    .pipe(plugins.plumber())
    .pipe(lintClientScripts());

  plugins.watch(paths.client.scripts, () => {
    gulp.src(paths.client.entryPoint)
      .pipe(plugins.plumber())
      .pipe(webpack(webpackConf.development))
      .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
      .pipe(plugins.livereload());
  });

  plugins.watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts())
    .pipe(plugins.livereload());
});

gulp.task('serve', cb => {
  runSequence(['clean:tmp', 'constant'],
    ['lint:scripts'],
    ['webpack'],
    ['start:server', 'start:client'],
    'watch',
    cb);
});

gulp.task('serve:dist', cb => {
  runSequence(
    'build',
    'env:all',
    'env:prod',
    ['start:server:prod', 'start:client'],
    cb);
});

gulp.task('test', cb => {
  return runSequence('test:server', 'test:client', cb);
});

gulp.task('test:server', cb => {
  runSequence(
    'env:all',
    'env:test',
    'mocha:unit',
    'mocha:integration',
    'mocha:coverage',
    cb);
});

gulp.task('mocha:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha());
});

gulp.task('mocha:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha());
});

gulp.task('test:client', ['webpack', 'constant'], (done) => {
  new KarmaServer({
    configFile: `${__dirname}/${paths.karma}`,
    singleRun: true
  }, done).start();
});

/********************
 * Build
 ********************/

//FIXME: looks like font-awesome isn't getting loaded
gulp.task('build', cb => {
  runSequence(
    'clean:dist',
    [
      'copy:server',
      'transpile:server',
      'env:all',
      'env:prod',
      'build:client'
    ],
    cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));
gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));

gulp.task('build:client', ['webpack', 'constant'], () => {});

gulp.task('constant', function () {
  let sharedConfig = require(`./${serverPath}/config/environment/shared`);
  return plugins.ngConstant({
      name: 'notedownApp.constants',
      deps: [],
      stream: true,
      constants: {appConfig: sharedConfig},
      template: '' +
      'export default angular.module("<%- moduleName %>"<% if (deps) { %>, <%= JSON.stringify(deps) %><% } %>) ' +
      '<% constants.forEach(function(constant) { %>' +
      '.constant("<%- constant.name %>", <%= constant.value %>) ' +
      '<% }) %>' +
      '.name;'
    })
    .pipe(plugins.rename({
      basename: 'app.constant'
    }))
    .pipe(gulp.dest(`${clientPath}/app/`))
});

gulp.task('copy:server', () => {
  return gulp.src([
      'package.json',
    ], {cwdbase: true})
    .pipe(gulp.dest(paths.dist));
});

gulp.task('coverage:pre', () => {
  return gulp.src(paths.server.scripts)
    // Covering files
    .pipe(plugins.istanbul({
      instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
      includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('coverage:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul())
  // Creating the reports after tests ran
});

gulp.task('coverage:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul())
  // Creating the reports after tests ran
});

gulp.task('mocha:coverage', cb => {
  runSequence('coverage:pre',
    'env:all',
    'env:test',
    'coverage:unit',
    'coverage:integration',
    cb);
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

gulp.task('test:e2e', ['env:all', 'env:test', 'start:server', 'webdriver_update'], cb => {
  gulp.src(paths.client.e2e)
    .pipe(protractor({
      configFile: 'protractor.conf.js',
    })).on('error', err => {
    console.log(err)
  }).on('end', () => {
    process.exit();
  });
});
