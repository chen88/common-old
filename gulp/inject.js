'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./../gulp_conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('inject', ['script', 'style', 'partial'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.app.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.app.tmp, '/serve/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(conf.paths.app.srcDist, '/*.module.js'),
    path.join(conf.paths.app.srcDist, '/*.js'),
  ], {read: false});

  var injectOptions = {
    ignorePath: [conf.paths.app.src, path.join(conf.paths.app.tmp, '/serve')],
    addRootSlash: false
  };

  var injectCommonScripts = gulp.src([
    path.join(conf.paths.common.srcDist, '/*.module.js'),
    path.join(conf.paths.common.srcDist, '/*.js'),
  ], {read: false});

  var injecCommontOptions = {
    ignorePath: [conf.paths.app.src, path.join(conf.paths.app.tmp, '/serve')],
    addRootSlash: false,
    name: 'common'
  };

  var injectDependentScripts = gulp.src([
    path.join('!' + conf.paths.app.srcDist, '/*.js'),
    path.join('!' + conf.paths.common.srcDist, '/*.js'),
    path.join(conf.paths.app.tmp, '/**/*.module.js'),
    path.join(conf.paths.app.tmp, '/**/*.js'),
  ], {read: false});

  var injecDependentOptions = {
    ignorePath: [conf.paths.app.src, path.join(conf.paths.app.tmp, '/serve')],
    addRootSlash: false,
    name: 'dependent'
  };

  return gulp.src(path.join(conf.paths.app.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe($.inject(injectCommonScripts, injecCommontOptions))
    .pipe($.inject(injectDependentScripts, injecDependentOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.app.tmp, '/serve')));
});
