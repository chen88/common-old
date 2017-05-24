'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./../gulp_conf');
var _ = require('lodash');

// var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var renameToHtml = function (path) {
  path.extname = '.html';
};

gulp.task('markupApp', function () {
  return gulp.src([
    path.join(conf.paths.app.src, '/app/{,*/,*/*/,*/*/*/}*.jade'),
    path.join( '!' + conf.paths.app.src, '/app/{,*/,*/*/,*/*/*/}*.tmp.jade')
  ])
    .pipe($.consolidate('jade', { basedir: conf.paths.app.src, doctype: 'html', pretty: '  ' })).on('error', conf.errorHandler('Jade'))
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(conf.paths.app.tmplDist));
});

gulp.task('markupCommon', ['markupCommonEs6'], function () {
  return gulp.src([
    path.join(conf.paths.common.src, '/**/{,*/,*/*/}*.jade'),
    path.join( '!' + conf.paths.common.src, '/**/{,*/,*/*/}*.tmp.jade')
  ])
    .pipe($.consolidate('jade', { basedir: conf.paths.common.src, doctype: 'html', pretty: '  ' })).on('error', conf.errorHandler('Jade'))
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(conf.paths.common.tmplDist));
});

gulp.task('markupCommonEs6', function () {
  return gulp.src([
    path.join(conf.paths.common.srcEs6, '/**/{,*/,*/*/}*.jade'),
    path.join( '!' + conf.paths.common.srcEs6, '/**/{,*/,*/*/}*.tmp.jade')
  ])
    .pipe($.consolidate('jade', { basedir: conf.paths.common.src, doctype: 'html', pretty: '  ' })).on('error', conf.errorHandler('Jade'))
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(conf.paths.common.tmplDist));
});

gulp.task('markupDependentModules', function () {
  var moduleDependencies = _.clone(conf.getDependencies().moduleDependencies);
  if(!moduleDependencies.length) {
    return gulp.src([]);
  }
  var lastModule = moduleDependencies.pop();
  var lastModulePaths =  conf.getDependentPaths(lastModule);

  _.forEach(moduleDependencies, function (module, index) {
    var modulePaths = conf.getDependentPaths(module);
    gulp.src([
      path.join(modulePaths.src, '/**/{,*/,*/*/}*.jade'),
      path.join( '!' + modulePaths.src, '/jade-temp/*.jade'),
      path.join( '!' + modulePaths.src, '/**/{,*/,*/*/}*.tmp.jade'),
    ])
      .pipe($.consolidate('jade', { basedir: conf.paths.common.src, doctype: 'html', pretty: '  ' })).on('error', conf.errorHandler('Jade'))
      .pipe($.rename(renameToHtml))
      .pipe(gulp.dest(modulePaths.tmplDist));
  });

  return gulp.src([
    path.join(lastModulePaths.src, '/**/{,*/,*/*/}*.jade'),
    path.join( '!' + lastModulePaths.src, '/**/jade-temp/*.jade'),
    path.join( '!' + lastModulePaths.src, '/**/{,*/,*/*/}*.tmp.jade')
  ])
    .pipe($.consolidate('jade', { basedir: conf.paths.common.src, doctype: 'html', pretty: '  ' })).on('error', conf.errorHandler('Jade'))
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(lastModulePaths.tmplDist));
});
