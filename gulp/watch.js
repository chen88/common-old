'use strict';

var path = require('path');
var gulp = require('gulp');
var _ = require('lodash');
var conf = require('./../gulp_conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', [
  // 'updateGitDependencies',
  'script:watch',
  'partial',
  'partialCommon',
  'inject'
  ], watch);

gulp.task('watch:noUpdate', [
  'script:watch',
  'partial',
  'partialCommon',
  'inject'
  ], watch);

gulp.task('watchSimple', watch);

function watch () {

  /** Index.html */
  gulp.watch([path.join(conf.paths.app.src, '/*.html'), 'bower.json'], ['inject']);

  /** Styles */
  gulp.watch([
    path.join(conf.paths.app.src, '/styles/{,*/,*/*/,*/*/*/}*.scss'),
    path.join(conf.paths.common.root, '/styles/{,*/,*/*/,*/*/*/}*.scss')
  ], ['style']);

  gulp.watch([
    path.join(conf.paths.app.srcDist, '/*.css')
  ], function (event) {
    if(event.type === 'changed') {
      browserSync.reload('*.css');
    }
  });

  /** HTML */
  gulp.watch([
    path.join(conf.paths.app.src, '/app/**/{,*/,*/*/,*/*/*/}*.html')
  ], ['partial']);

  gulp.watch(path.join(conf.paths.app.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });

  gulp.watch([
    path.join(conf.paths.common.src, '/{,*/,*/*/,*/*/*/}*.html')
  ], ['partialCommon']);

  /** Jade */
  gulp.watch([
    path.join(conf.paths.app.src, '/app/**/{,*/,*/*/,*/*/*/}*.*'),
    path.join( '!' + conf.paths.app.src, '/app/**/{,*/,*/*/,*/*/*/}*.{js,html,scss,css,md}'),
  ], ['partialApp']);

  gulp.watch([
    path.join(conf.paths.common.src, '/**/{,*/,*/*/,*/*/*/}*.*'),
    path.join( '!' + conf.paths.common.src, '/{,*/,*/*/,*/*/*/}*.{js,html,scss,css,md}'),
  ], ['partialCommon', 'partialApp']);

  gulp.watch([
    path.join(conf.paths.common.srcEs6, '/**/{,*/,*/*/,*/*/*/}*.*'),
    path.join( '!' + conf.paths.common.srcEs6, '/{,*/,*/*/,*/*/*/}*.{js,html,scss,css,md}'),
  ], ['partialCommon', 'partialApp']);

  gulp.watch([
    path.join(conf.paths.common.root, '/jade-temp/*')
  ], ['copyJade']);

  gulp.watch([
    path.join(conf.paths.common.root, '/scripts-es6/common-classes/*')
  ], ['copyCommonClasses']);

  gulp.watch([
    path.join(conf.paths.app.src, '/app/common-classes/*')
  ], ['reverseCopyCommonClasses']);

  /** JavaScripts */
  // gulp.watch([
  //   path.join(conf.paths.app.src, '/app/**/{,*/,*/*/}*.js'),
  // ], function (event) {
  //   // if(event.type === 'added') {
  //   //   gulp.start('script');
  //   // }
  //   // gulp.start('script');
  // });

  // gulp.watch([
  //   path.join(conf.paths.common.src, '/**/{,*/,*/*/,*/*/*/}*.js'),
  // ], function (event) {
  //   // if(event.type === 'added') {
  //   //   gulp.start('scriptCommon');
  //   // }
  //   // gulp.start('scriptCommon');
  // });

  // gulp.watch([
  //   path.join(conf.paths.common.srcEs6, '/**/{,*/,*/*/,*/*/*/}*.js'),
  // ], function (event) {
  //   // if(event.type === 'added') {
  //   //   gulp.start('scriptCommonEs6:watch');
  //   // }
  //   // gulp.start('scriptCommonEs6');
  // });

  /** Watch Dependent Modules */
  var dependentModules = conf.getDependencies().moduleDependencies;
  if(!_.isEmpty(dependentModules)) {
    _.forEach(dependentModules, function (module) {
      var modulePaths = conf.getDependentPaths(module);

      /** Styles */
      gulp.watch([
        path.join(conf.paths.app.src, '/styles/{,*/,*/*/,*/*/*/}*.scss'),
        path.join(conf.paths.common.root, '/styles/{,*/,*/*/,*/*/*/}*.scss')
      ], ['style']);

      /** Jade */
      gulp.watch([
        path.join(modulePaths.src, '/app/**/{,*/,*/*/,*/*/*/}*'),
        path.join( '!' + modulePaths.src, '/app/**/{,*/,*/*/,*/*/*/}*.{js,html,scss,css,md}'),
      ], ['partial']);

      /** Javascripts */
      // gulp.watch([
      //   path.join(modulePaths.src, '/app/**/{,*/,*/*/}*.js')
      // ], function (event) {
      //   // if(event.type === 'added') {
      //   // gulp.start('script' + _.capitalize(module));
      //   // }
      // });

      /** HTML */
      gulp.watch([
        path.join(modulePaths.src, '/app/**/{,*/,*/*/,*/*/*/}*.html')
      ], ['partial']);

      gulp.watch(path.join(modulePaths.src, '/app/**/*.html'), function(event) {
        browserSync.reload(event.path);
      });
    });
  }
}
