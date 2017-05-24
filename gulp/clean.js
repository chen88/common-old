'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./../gulp_conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('clean', function (done) {
  $.del([path.join(conf.paths.app.dist, '/'), path.join(conf.paths.app.tmp, '/'), 'target/'], done);
});

gulp.task('cleanWebDist', function () {
  $.del([
    path.join(conf.paths.webDist.root, '/*'),
    path.join('!' + conf.paths.webDist.root, '/.hg'),
    path.join('!' + conf.paths.webDist.root, '/.hg*'),
  ]);
});
