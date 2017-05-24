'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var conf = require('./../gulp_conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

gulp.task('deploy', ['cleanWebDist'], function () {
  var isWebDistExisted = fs.statSync(conf.paths.webDist.root).isDirectory();
  if(!isWebDistExisted) {
    return gulp.src([]);
  }

  return gulp.src([
    path.join(conf.paths.app.dist, '/{,*/,*/*/}*.*')
  ]).pipe(gulp.dest(conf.paths.webDist.root));
});
