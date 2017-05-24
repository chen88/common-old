'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var conf = require('./../gulp_conf');

var packageJson;
var buildVersion;

function getPackageJson () {
  packageJson = packageJson || JSON.parse(fs.readFileSync('package.json').toString());
  return packageJson;
}

function setBuildVersion (branch) {
  var version = getPackageJson().buildVersion;
  if(!version) {
    buildVersion = branch;
    return branch;
  }
  buildVersion = version + '-' + branch;
  return buildVersion;
}

function getGitBranch (cb, quiet) {
  cb = typeof(cb) === 'function' ? cb : function () {};
  return $.git.revParse({args: '--abbrev-ref HEAD', quiet: quiet}, (err, branch) => {
    branch = branch.split('/')[0];
    console.log(branch);
    cb(branch);
  });
}

gulp.task('dockerBuild', () => {
  return getGitBranch((branch) => {
    setBuildVersion(branch);
    let deployTo = getPackageJson().deployTo;
    let dockerCmd = 'docker build -t ' + deployTo + ':' + buildVersion + ' .';

    $.util.log($.util.colors.cyan("Build Version: ") + $.util.colors.magenta(buildVersion));
    $.util.log($.util.colors.cyan("Docker Build CMD: ") + $.util.colors.magenta(dockerCmd));

    return gulp.src('./').pipe($.shell([
      dockerCmd
    ], {
      errorMessage: 'Failed to build',
      ignoreErrors: false,
      cwd: 'target/',
      quiet: false
    }));
  }, true);
});

gulp.task('dockerPush', () => {
  return getGitBranch((branch) => {
    setBuildVersion(branch);
    let deployTo = getPackageJson().deployTo;
    let dockerCmd = 'docker push ' + deployTo + ':' + buildVersion;

    $.util.log($.util.colors.cyan("Push Version: ") + $.util.colors.magenta(buildVersion));
    $.util.log($.util.colors.cyan("Push Cmd: ") + $.util.colors.magenta(dockerCmd));

    return gulp.src('./').pipe($.shell([
      dockerCmd
    ], {
      errorMessage: 'Failed to push',
      ignoreErrors: false,
      cwd: 'target/',
      quiet: false
    }));
  }, true);
});

// for hg
gulp.task('dockerBuildHg', ['hgReadBranch'], function () {
  var hgBranch = conf.getHgBranch();
  var deployTo = getPackageJson().deployTo;
  setBuildVersion(hgBranch);

  var dockerCmd = 'docker build -t ' + deployTo + ':' + buildVersion + ' .';

  $.util.log($.util.colors.cyan("Build Version: ") + $.util.colors.magenta(buildVersion));
  $.util.log($.util.colors.cyan("Docker Build CMD: ") + $.util.colors.magenta(dockerCmd));

  return gulp.src('./').pipe($.shell([
    dockerCmd
  ], {
    errorMessage: 'Failed to build',
    ignoreErrors: false,
    cwd: 'target/',
    quiet: false
  }));
});

// for hg
gulp.task('dockerPushHg', ['hgReadBranch'], function () {
  var hgBranch = conf.getHgBranch();
  var deployTo = getPackageJson().deployTo;
  setBuildVersion(hgBranch);

  var dockerCmd = 'docker push ' + deployTo + ':' + buildVersion;

  $.util.log($.util.colors.cyan("Push Version: ") + $.util.colors.magenta(buildVersion));
  $.util.log($.util.colors.cyan("Push Cmd: ") + $.util.colors.magenta(dockerCmd));

  return gulp.src('./').pipe($.shell([
    dockerCmd
  ], {
    errorMessage: 'Failed to push',
    ignoreErrors: false,
    cwd: 'target/',
    quiet: false
  }));
});
