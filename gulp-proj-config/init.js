/**
 * Extend && Install Package
 * Extend && Install Bower
 * Extend Jshint
 * Copy app dependencies to tkg-config/
 */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var _ = require('lodash');
var $ = require('gulp-load-plugins')();

var conf = require('./../gulp_conf');

gulp.task('copyDefaultDependencies', function () {
  function renameDep (path) {
    path.basename = path.basename.replace('_default', '');
  }

  let dependencyJson = 'tkg_default_dependencies.json';
  let gitDependencyJson = 'tkg_default_git_dependencies.json';
  let renamedDependencyJson = {basename: dependencyJson};
  let renamedGitDependencyJson = {basename: gitDependencyJson};
  renameDep(renamedDependencyJson);
  renameDep(renamedGitDependencyJson);

  let sources = [];
  if(conf.alertWrongPaths('./tkg-config/' + renamedDependencyJson.basename)) {

    sources.push(path.join(conf.paths.common.root, 'extend-json/', dependencyJson));
  }
  if(conf.alertWrongPaths('./tkg-config/' + renamedGitDependencyJson.basename)) {
    sources.push(path.join(conf.paths.common.root, 'extend-json/', gitDependencyJson));
  }
  return gulp.src(sources)
    .pipe($.rename(renameDep))
    .pipe(gulp.dest('./tkg-config'));
});

gulp.task('init', [
  'renameHgToGitIgnore',
  'copyGitDependencies',
  'copyDefaultDependencies',
  'addGitSubmodules',
  'copyInit',
  'extendJsonConfig',
  'installDependencies'
]);
