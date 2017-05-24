var gulp = require('gulp');
var _ = require('lodash');

var $ = require('gulp-load-plugins')();

gulp.task('installBowerDependencies', ['extendBower'], function () {
  return gulp.src(['bower.json'])
    .pipe($.install());
});

gulp.task('installPackageDependencies', ['extendPackage'], function () {
  return gulp.src(['package.json'])
    .pipe($.install());
});

gulp.task('installDependencies', ['extendPackage', 'extendBower'], function () {
  return gulp.src(['bower.json', 'package.json'])
    .pipe($.install());
});
