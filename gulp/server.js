'use strict';

var path = require('path');
var gulp = require('gulp');
var gUtil = require('gulp-util');
var conf = require('./../gulp_conf');
var _ = require('lodash');
var argv = require('yargs').argv;
var wrench = require('wrench');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser, enableProxy) {
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

  var argKeys = _.keys(argv);
  var proxyUrl = argv.proxy;

  var proxies = null;
  if(proxyUrl) {
    gUtil.log(gUtil.colors.yellow('Proxy is enabled'));
    var proxy = proxyMiddleware('/api', {
      target: proxyUrl,
      changeOrigin: true,
      logLevel: 'silent'
    });
    proxies = [
      proxy
    ];
  } else if(enableProxy === 'scout') {
    gUtil.log(gUtil.colors.yellow('Proxy is enabled'));
    proxies = [];
    var scoutProxy = proxyMiddleware('/api', {
      target: 'https://scout-dev.tkginternal.com',
      changeOrigin: true,
      logLevel: 'silent'
    });
    var scoutLocalProxy = proxyMiddleware('/local', {
      target: 'http://localhost:9090',
      changeOrigin: true,
      pathRewrite: {
        '/local': '',
      },
      logLevel: 'silent'
    });

    proxies = [
      scoutProxy,
      scoutLocalProxy
    ];
  } else if(enableProxy === 'ranger') {
    gUtil.log(gUtil.colors.yellow('Proxy is enabled'));
    proxies = [];
    var scoutProxy = proxyMiddleware('/api', {
      target: 'https://ranger-dev.tkginternal.com',
      changeOrigin: true,
      logLevel: 'silent'
    });
    var scoutLocalProxy = proxyMiddleware('/local', {
      target: 'http://localhost:8089',
      changeOrigin: true,
      pathRewrite: {
        '/local': '',
      },
      logLevel: 'silent'
    });
    proxies = [
      scoutProxy,
      scoutLocalProxy
    ];
  }

  if(proxies) {
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
 * gulp serve:ranger
 * gulp serve --proxy={proxyUrl}
 * @example gulp serve --proxy=https://ranger-dev.tkginternal.com
 *
 */
gulp.task('serve', serveTasks, function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json'
  ]);
});

gulp.task('serve:noUpdate', ['copyJade', 'copyCommonClasses', 'watch:noUpdate'], function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.app.dist);
});

gulp.task('serve:dist:noUpdate', ['build:noUpdate'], function () {
  browserSyncInit(conf.paths.app.dist);
});


gulp.task('serve:dist:simple', function () {
  browserSyncInit(conf.paths.app.dist);
});

gulp.task('serve:prod', ['buildProd'], function () {
  browserSyncInit(conf.paths.app.dist);
});

gulp.task('serve:scout', serveTasks, function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json',
  ], undefined, 'scout');
});

gulp.task('serve:dist:scout', ['build'], function () {
  browserSyncInit(conf.paths.app.dist, undefined, 'scout');
});

gulp.task('serve:prod:scout', ['buildProd'], function () {
  browserSyncInit(conf.paths.app.dist, undefined, 'scout');
});

gulp.task('serve:prodSimple:scout', [], function () {
  browserSyncInit(conf.paths.app.dist, undefined, 'scout');
});

gulp.task('simpleServe', function () {
  browserSyncInit([
    path.join(conf.paths.app.tmp, '/serve'),
    conf.paths.app.src,
    conf.paths.common.root,
    'sample-json',
  ], undefined, 'scout');
});
