'use strict';
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var conf = require('./../gulp_conf');

gulp.task('copyInit', ['copyStyles', 'copyFavi', 'copyJade', 'copyCommonClasses']);

gulp.task('copyStyles', function () {
  var dist = conf.paths.app.src + '/styles/';
  var distStyle = dist + 'main.scss';
  var isFile = false;
  try {
    isFile = fs.statSync(distStyle).isFile();
  } catch (e) {
    isFile = false;
  }
  var origStyle = conf.paths.app.src + '/app/index.scss';
  var isOrigFile = false ;
  try {
    isOrigFile = fs.statSync(origStyle).isFile();
  } catch (e) {
    isOrigFile = false;
  }

  var renameToMain = function (path) {
    path.basename = 'main';
  };

  if(!isFile && isOrigFile) {
    var contentBefore = '$fa-font-path: "../../bower_components/font-awesome/fonts";\n';
    var contentAfter =
      '\n@import "../../src-common/styles/variables";\n' +
      '// Insert your variable file here\n' +
      '@import "../../src-common/styles/common-modules";\n' +
      '// Insert your module here\n';
    var orginStyleContent = fs.readFileSync(origStyle).toString();
    fs.writeFileSync(origStyle, contentBefore + orginStyleContent + contentAfter);

    var stream = gulp.src(origStyle)
      .pipe($.rename(renameToMain))
      .pipe(gulp.dest(dist));
    $.del(origStyle);
    return stream;
  } else {
    return gulp.src([]);
  }
});

gulp.task('copyFavi', function () {
  return gulp.src(path.join(conf.paths.common.root, '/assets/images/favicon.ico'))
    .pipe(gulp.dest(conf.paths.app.src));
});

gulp.task('copyJade', function () {
  return gulp.src(path.join(conf.paths.common.root, '/jade-temp/**'))
    .pipe(gulp.dest(path.join(conf.paths.app.src, '/jade-temp')));
});

gulp.task('copyCommonClasses', function () {
  return gulp.src(path.join(conf.paths.common.root, '/scripts-es6/common-classes/**'))
    .pipe(gulp.dest(path.join(conf.paths.app.src, '/app/common-classes')));
});

gulp.task('reverseCopyCommonClasses', function () {
  return gulp.src(path.join(conf.paths.app.src, '/app/common-classes/**'))
    .pipe(gulp.dest(path.join(conf.paths.common.root, '/scripts-es6/common-classes')));
});

gulp.task('copyEsLint', function () {
  return gulp.src(path.join(conf.paths.common.root, '/.eslintrc'))
    .pipe(gulp.dest('./'));
});

