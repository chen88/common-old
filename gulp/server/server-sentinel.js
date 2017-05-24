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
  browser = browser === undefined ? 'google chrome' : browser;

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

  var defaultProxyUrl = 'https://sentinel-dev.tkginternal.com';
  var sentinelProxyUrl = argv.sent || argv.sentinel || defaultProxyUrl;
  var rangerProxyUrl = argv.ranger || defaultProxyUrl;
  var replace = argv.r;
  gUtil.log(gUtil.colors.yellow('Sentinel Proxying: ' + sentinelProxyUrl));
  gUtil.log(gUtil.colors.yellow('Ranger Proxying: ' + rangerProxyUrl));


  var proxies = [];
  var sentProxy = proxyMiddleware('/api/sentinel', {
    target: sentinelProxyUrl,
    changeOrigin: true,
    logLevel: 'silent',
    pathRewrite: sentinelProxyUrl !== defaultProxyUrl || replace ? {'/api/sentinel': ''} : {},
  });
  var rangerProxy = proxyMiddleware('/api/ranger', {
    target: rangerProxyUrl,
    changeOrigin: true,
    logLevel: 'silent',
    pathRewrite: rangerProxyUrl !== defaultProxyUrl || replace ? {'/api/ranger': ''} : {},
  });
  proxies = [
    sentProxy,
    rangerProxy
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

/**
 * gulp sent
 * gulp sent --sent={sentinelUrl} --ranger={rangerUrl} -r
 */
gulp.task('sent', ['serve:sentinel']);

gulp.task('serve:sentinel', serveTasks, function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json',
  ], undefined);
});

gulp.task('serve:dist:sentinel', ['build'], function () {
  browserSyncInit(conf.paths.app.dist, undefined);
});

gulp.task('serve:prod:sentinel', ['buildProd'], function () {
  browserSyncInit(conf.paths.app.dist, undefined);
});

gulp.task('serve:prodSimple:sentinel', [], function () {
  browserSyncInit(conf.paths.app.dist, undefined);
});

gulp.task('simpleServe:sentinel', function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json',
  ], undefined);
});
