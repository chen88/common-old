'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var conf = require('./../gulp_conf');
var argv = require('yargs').argv;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

var bowerPath = JSON.parse(fs.readFileSync('.bowerrc').toString()).directory;

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.app.dist, '/fonts/')));
});

gulp.task('bootstrapFonts', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(bowerPath, '/bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}'),
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.app.dist, '/fonts/')));
});

gulp.task('other', ['bootstrapFonts'], function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.app.src, '/**/*'),
    path.join(bowerPath, '/font-awesome/**/*.{eot,svg,ttf,woff,woff2}'),
    path.join(conf.paths.common.root, '/**/{,*/,*/*/}*.{png,jpg,jpeg,gif,ico}'),
    path.join('!' + conf.paths.app.src, '/**/*.{html,css,js,scss,jade}'),
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.app.dist, '/')));
});

let banner = `/* ${conf.isProd() ? 'Production: ' : 'Develop: '} ${new Date()} */ \n`;

gulp.task('html', ['partial', 'inject'], function () {
  var isProd = conf.isProd();
  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.app.tmp, '/serve/*.html'))
    // .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe($.if(isProd, $.rev()))
    .pipe(jsFilter)
    .pipe($.if(isProd, $.sourcemaps.init()))
    .pipe($.if(isProd, $.uglify({
      preserveComments: $.uglifySaveLicense,
      mangle: false
    }))).on('error', conf.errorHandler('Uglify'))
    .pipe($.if(isProd, $.sourcemaps.write('maps')))
    .pipe($.header(banner))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.replace('../../bower_components/bootstrap-sass-official/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.replace('../../bower_components/font-awesome/fonts/', '../fonts/'))
    .pipe($.cssnano())
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    // .pipe(htmlFilter)
    // .pipe($.minifyHtml({
    //   empty: true,
    //   spare: true,
    //   quotes: true,
    //   conditionals: true
    // }))
    // .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.app.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.app.dist, '/'), showFiles: true }));
});

gulp.task('build', ['argv', 'html', 'fonts', 'other'], function (cb) {
  return dockerInit();
});

gulp.task('build:update', ['argv', 'updateGitDependencies', 'html', 'fonts', 'other'], function (cb) {
  return dockerInit();
});

gulp.task('build:noUpdate', ['argv', 'html', 'fonts', 'other'], function (cb) {
  return dockerInit();
});

gulp.task('buildProd', ['setProd', 'build']);

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}
var mkdirpSync = function (dirpath) {
  var parts = dirpath.split(path.sep);
  for( var i = 1; i <= parts.length; i++ ) {
    mkdirSync( path.join.apply(null, parts.slice(0, i)) );
  }
}

gulp.task('argv', function () {
  var contents = '';
  if(argv.RANGER_URL) {
    var rangerUrl = argv.RANGER_URL;
    contents = 'window.RANGER_URL = "' + rangerUrl + '"';
    $.util.log($.util.colors.magenta('Setting Ranger Url to: ' + rangerUrl));
  }

  try {
    mkdirpSync(conf.paths.common.srcDist);
  } catch(e) {
    console.log(e);
  }
  fs.writeFile(path.join(conf.paths.common.srcDist, 'rest-url.js'), contents, { flags: 'wx' }, function (err) {
    if(err) {
      throw err;
    }
  });
});

gulp.task('testArgv', () => {
  console.log(argv);
});

gulp.task('setProd', function () {
  conf.setProd();
});

function dockerInit () {
  var dockerFile = './Dockerfile';
  var initFile = './init.sh';
  if(!conf.alertWrongPaths(dockerFile)) {
    var sources = [
      dockerFile,
      path.join(conf.paths.app.dist, '/**')
    ];
    if(!conf.alertWrongPaths(initFile)) {
      sources.push(initFile);
    }
    return gulp.src(sources)
      .pipe($.copy('target/'));
  }
  return gulp.src([]);
}

gulp.task('docker', dockerInit);
