'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./../gulp_conf');
var _ = require('lodash');

var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

var appName = conf.appName;

var transformUrl = function (url) {
  return url.replace(/app\//, '').replace(/app\\/, '');
};

gulp.task('partial', ['partialApp', 'partialCommon', 'partialDependentModules']);

gulp.task('partialApp', ['markupApp'], function () {
  return gulp.src([
    path.join(conf.paths.app.src, '/{,*/,*/*/,*/*/*/}*.html'),
    path.join(conf.paths.app.tmplDist, '/{,*/,*/*/,*/*/*/}*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache(appName + '-cached-html.js', {
      module: appName,
      root: appName,
      transformUrl: transformUrl
    }))
    .pipe(gulp.dest(conf.paths.app.srcDist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('partialCommon', ['markupCommon'], function () {
  return gulp.src([
    path.join(conf.paths.common.src, '/{,*/,*/*/,*/*/*/}*.html'),
    path.join(conf.paths.common.tmplDist, '/{,*/,*/*/,*/*/*/}*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('common-cached-html.js', {
      module: 'tkgCommon',
    }))
    .pipe(gulp.dest(conf.paths.common.srcDist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('partialDependentModules', ['markupDependentModules'], function () {
  var moduleDependencies = _.clone(conf.getDependencies().moduleDependencies);
  if(!moduleDependencies.length) {
    return gulp.src([]);
  }
  var lastModule = moduleDependencies.pop();
  var lastModulePaths =  conf.getDependentPaths(lastModule);

  _.forEach(moduleDependencies, function (module, index) {
    var modulePaths = conf.getDependentPaths(module);
    var wrongPath = conf.alertWrongPaths(modulePaths.src);
    if(wrongPath) {
      $.util.log($.util.colors.red('Please remove it from the moduleDependencies in config/tkg-dependencies.json'));
      return;
    }
    gulp.src([
      path.join(modulePaths.src, '/{,*/,*/*/,*/*/*/}*.html'),
      path.join(modulePaths.tmplDist, '/{,*/,*/*/,*/*/*/}*.html')
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache(module + '-cached-html.js', {
        module: module,
        root: module,
        transformUrl: transformUrl
      }))
      .pipe(gulp.dest(modulePaths.srcDist))
  });

  var wrongPath = conf.alertWrongPaths(lastModulePaths.src);
  if(wrongPath) {
    $.util.log($.util.colors.red('Please remove it from the moduleDependencies in config/tkg-dependencies.json'));
    return gulp.src([]);
  }

  return gulp.src([
    path.join(lastModulePaths.src, '/{,*/,*/*/,*/*/*/}*.html'),
    path.join(lastModulePaths.tmplDist, '/{,*/,*/*/,*/*/*/}*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache(lastModule + '-cached-html.js', {
      module: lastModule,
      root: lastModule,
      transformUrl: transformUrl
    }))
    .pipe(gulp.dest(lastModulePaths.srcDist))
});
