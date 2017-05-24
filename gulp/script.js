'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var _ = require('lodash');
var conf = require('./../gulp_conf');
var appName = conf.appName;

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('gulp-load-plugins')();



function webpackWrapper(module, watch, callback) {
  var webpackOptions = {
    watch: watch,
    module: {
      // preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}],
      loaders: [{ test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel-loader?presets[]=es2015']}]
    },
    output: { filename: module + '.module.js' },
    // quiet: true
  };

  if(watch) {
    webpackOptions.devtool = 'inline-source-map';
  }

  var webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }

    //Log Jshint
    if(isEs6) {
      $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: false
      }));
    }

    browserSync.reload();
    if(watch) {
      watch = false;
      callback();
    }
  };

  var getDependencyList = function () {
    var tkgDependencies = conf.getDependencies().commonDependencies;
    var dependenciesList = [];
    _.forEach(tkgDependencies, function (appName) {
      var app = _.find(conf.apps, {name: appName});
      if(app) {
        dependenciesList.push(app);
      }
    });

    // need to place common module to the last index in order for it to be concatenated first
    var commonModule = _.remove(dependenciesList, {name: 'common'});
    dependenciesList = dependenciesList.concat(commonModule);

    return dependenciesList;
  }


  var sources = [];
  var destination;
  var isEs6 = false;
  var doNotSort = false;
  if(module === appName) {
    /** current app */
    isEs6 = conf.isEs6(path.join(conf.paths.app.src, '/app'));
    if(isEs6) {
      webpackOptions.module.preLoaders = [{ test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}];
      sources = [
        path.join(conf.paths.app.src, '/app/{,*/,*/*/}*.js'),
        path.join(conf.paths.app.src,  '/app/index.module.js'),
      ];
    } else {
      sources = [
        path.join(conf.paths.app.src, '/app/{,*/,*/*/}*.js'),
      ];
    }
    destination = conf.paths.app.srcDist;
  } else if(module === 'common') {
    /** common module */
    doNotSort = true;
    var dependenciesList = getDependencyList();
    _.forEach(dependenciesList, function (app) {
      sources.push(path.join(conf.paths.common.src, '/', app.name, '/{,*/,*/*/,*/*/*/}*.js'));
      // sources.push(path.join(conf.paths.common.src, '/', app.name, '/', app.name + '.js'));
    });
    sources.push(path.join(conf.paths.common.src, 'common/common.js'));
    destination = conf.paths.common.srcDist;
  } else if (module === 'commonEs6') {
    isEs6 = true;
    var dependenciesList = getDependencyList();
    _.forEach(dependenciesList, function (app) {
      sources.push(path.join(conf.paths.common.srcEs6, '/', app.name, '/' + app.name + '.index.js'));
      sources.push(path.join(conf.paths.common.srcEs6, '/', app.name, '/{,*/,*/*/,*/*/*/}*.js'));
      // sources.push(path.join(conf.paths.common.src, '/', app.name, '/', app.name + '.js'));
    });
    destination = conf.paths.common.srcDist;
  } else {
    /** dependent modules (src-{module})*/
    var modulePaths = conf.getDependentPaths(module);
    isEs6 = conf.isEs6(path.join(modulePaths.src, '/app'));
    if(isEs6) {
      sources = [
        path.join(modulePaths.src, '/app/{,*/,*/*/}*.js'),
        path.join(modulePaths.src,  '/app/index.module.js'),
      ];
    } else {
      sources = [
        path.join(modulePaths.src, '/app/{,*/,*/*/}*.js'),
      ];
    }

    destination = modulePaths.srcDist;
  }

  var wrongPaths = conf.alertWrongPaths(sources);

  if(wrongPaths) {
    wrongPaths = conf.alertWrongPaths(sources, true);
    _.forEach(wrongPaths, function(path) {
      _.remove(sources, path);
    });
    console.log(sources);
    // return gulp.src();
  }

  return gulp.src(sources)
    .pipe($.if(!isEs6 && doNotSort, $.angularFilesort()))
    .pipe(webpack(webpackOptions, null, webpackChangeHandler))
    .pipe(gulp.dest(destination));
}

var watchers = [
  'scriptApp:watch',
  // 'scriptCommon:watch',
  'scriptDependentModules:watch',
  'scriptCommonEs6:watch'
];

var noWatchers = _.map(watchers, function (task) {
  return task.replace(/:watch/, '');
});

gulp.task('script', noWatchers);
gulp.task('script:watch', watchers);

gulp.task('scriptApp', function () {
  return webpackWrapper(appName, false);
});

gulp.task('scriptApp:watch', ['scriptApp'], function (callback) {
  return webpackWrapper(appName, true, callback);
});

// gulp.task('scriptCommon', function () {
//   return webpackWrapper('common', false);
// });

// gulp.task('scriptCommon:watch', ['scriptCommon'], function (callback) {
//   return webpackWrapper('common', true, callback);
// });

gulp.task('scriptCommonEs6', function () {
  return webpackWrapper('commonEs6', false);
});

gulp.task('scriptCommonEs6:watch', ['scriptCommonEs6'], function (callback) {
  return webpackWrapper('commonEs6', true, callback);
});


function startDependentWebpack (callback, watch) {
  var moduleDependencies = _.clone(conf.getDependencies().moduleDependencies);
  if(!moduleDependencies.length) {
    return gulp.src([]);
  }
  var lastModule = moduleDependencies.pop();
  _.forEach(moduleDependencies, function (module, index) {
    webpackWrapper(module, watch, callback, true);
  });
  return webpackWrapper(lastModule, watch, callback);
}

gulp.task('scriptDependentModules', function () {
  return startDependentWebpack();
});

gulp.task('scriptDependentModules:watch', ['scriptDependentModules'], function (callback) {
  return startDependentWebpack(callback, true);
});

// _.forEach(conf.getDependencies().moduleDependencies, function (module) {
//   gulp.task('script' + _.capitalize(module), function () {
//     webpackWrapper(module, false)
//   });
// });
