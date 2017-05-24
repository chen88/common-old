'use strict';

var path = require('path');
var gulp = require('gulp');
var gUtil = require('gulp-util');
var conf = require('./../../gulp_conf');
var _ = require('lodash');
var argv = require('yargs').argv;

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.app.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.app.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  gUtil.log(gUtil.colors.yellow('Proxy is enabled'));

  var argKeys = _.keys(argv);
  var apiUrl;
  _.forEach(argKeys, function (key) {
    if(/nms/i.test(key)) {
      apiUrl = argv[key];
      gUtil.log(gUtil.colors.yellow('Proxying: ' + apiUrl));
      return false;
    }
  });


  var proxies = [];

  var internalProxy = proxyMiddleware('/internal', {
    target: 'http://10.0.2.226:82',
    changeOrigin: true,

    pathRewrite: {
      '/internal': '',
    },
    logLevel: 'debug'
  });
  var proxy = proxyMiddleware('/api', {
    target: 'http://10.0.2.226',
    changeOrigin: true,
    logLevel: 'silent'
  });
  proxies = [
    internalProxy,
    proxy,
  ];

  if(proxies && proxies.length) {
    server.middleware = proxies;
  }

  /*
   * You can add a proxy to your backend by uncommenting the line bellow.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', proxyHost: 'jsonplaceholder.typicode.com'});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    ghostMode: false,
    notify: false,
    // reloadDebounce: 2000,
    // reloadDelay: 500
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

// var serveTasks = ['updateGitDependencies', 'copyJade', 'copyCommonClasses', 'watch'];
var serveTasks = ['copyJade', 'copyCommonClasses', 'watch'];

gulp.task('serve:nms', serveTasks, function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json',
  ], undefined);
});

gulp.task('nms', () => {
  gulp.start('serve:noUpdate:nms');
});

gulp.task('serve:noUpdate:nms', ['copyJade', 'copyCommonClasses', 'watch:noUpdate'], function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json'
  ]);
});

gulp.task('serve:dist:nms', ['build:noUpdate'], function () {
  browserSyncInit(conf.paths.app.dist, undefined);
});

gulp.task('serve:prod:nms', ['buildProd'], function () {
  browserSyncInit(conf.paths.app.dist, undefined);
});

gulp.task('serve:prodSimple:nms', [], function () {
  browserSyncInit(conf.paths.app.dist, undefined);
});

gulp.task('simpleServe:nms', function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json',
  ], undefined);
});
