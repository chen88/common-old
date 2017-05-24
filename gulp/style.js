'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./../gulp_conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('style', function () {
  var sassOptions = {
    style: 'expanded'
  };

  var cssFilter = $.filter('**/*.css');

  return gulp.src([
    path.join(conf.paths.app.src, '/styles/main.scss')
  ])
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(conf.paths.app.srcDist))
    .pipe(browserSync.stream({match: ['*.css', '**/*.css']}));
});
