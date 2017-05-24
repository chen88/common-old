'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var conf = require('./../gulp_conf');
var q = require('q');
var _ = require('lodash');

var baseJsonPath = './../../';
var baseExtendedJsonPath = './../extend-json/';

var bowerJSONPath = 'bower.json';
var bowerJson = require('./../../bower.json');
var originalBowerJson = JSON.parse(JSON.stringify(bowerJson));
var extendBowerJson = require(baseExtendedJsonPath + 'extend_bower.json');

var packageJSONPath = 'package.json';
var packageJson = require('./../../package.json');
var originalPackageJson = JSON.parse(JSON.stringify(packageJson));
var extendPackageJson = require(baseExtendedJsonPath + 'extend_package.json');

var jshintJSONPath = '.jshintrc';
var extendJshintJson = require(baseExtendedJsonPath + 'extend_jshint.json');

var eslintJSONPath = '.eslintrc';
var extendEshintJson = require(baseExtendedJsonPath + 'extend_eslint.json');

var $ = require('gulp-load-plugins')();


gulp.task('extendJsonConfig', ['extendBower', 'extendPackage', 'extendJshint', 'extendEslint']);

gulp.task('extendBower', function () {
  var defer = q.defer();
  var devDependencies = extendBowerJson.devDependencies;
  var dependencies = extendBowerJson.dependencies;
  if(devDependencies) {
    for(var key in devDependencies) {
      bowerJson.devDependencies[key] = devDependencies[key];
    }
  }

  if(dependencies) {
    for(var key in dependencies) {
      bowerJson.dependencies[key] = dependencies[key];
    }
  }

  if(!_.isEqual(originalBowerJson, bowerJson)) {
    fs.writeFile(bowerJSONPath, JSON.stringify(bowerJson, null, 2), function (err, data) {
      if(err) {
        throw err;
      }
      $.util.log($.util.colors.magenta('Finished extending bower json with common bower JSON'));
      defer.resolve();
    });
  } else {
    defer.resolve();
    $.util.log($.util.colors.red('No new bower dependencies'));
  }

  return defer.promise;
});

gulp.task('extendPackage', function () {
  var defer = q.defer();
  var devDependencies = extendPackageJson.devDependencies;
  var dependencies = extendPackageJson.dependencies;
  if(devDependencies) {
    for(var key in devDependencies) {
      packageJson.devDependencies[key] = devDependencies[key];
    }
  }

  if(dependencies) {
    for(var key in dependencies) {
      packageJson.dependencies[key] = dependencies[key];
    }
  }

  if(!_.isEqual(originalPackageJson, packageJson)) {
    fs.writeFile(packageJSONPath, JSON.stringify(packageJson, null, 2), function (err, data) {
      if(err) {
        throw err;
      }
      $.util.log($.util.colors.magenta('Finished extending package json with common package JSON'));
      defer.resolve();
    });
  } else {
    defer.resolve();
    $.util.log($.util.colors.red('No new node module dependencies'));
  }

  return defer.promise;
});

gulp.task('extendJshint', function () {
  var defer = q.defer();
  var isFile = false;
  try {
    isFile = fs.statSync('./.jshintrc').isFile();
  } catch (e) {
    isFile = false;
  }
  if(isFile) {
    var jshintJson = JSON.parse(fs.readFileSync('./.jshintrc').toString());
    var originalJshintJson = JSON.parse(JSON.stringify(jshintJson));
    if(extendJshintJson) {
      for(var key in extendJshintJson) {
        jshintJson[key] = extendJshintJson[key];
      }
    }

    if(!_.isEqual(originalJshintJson, jshintJson)) {
      fs.writeFile(jshintJSONPath, JSON.stringify(jshintJson, null, 2), function (err, data) {
        if(err) {
          throw err;
        }
        $.util.log($.util.colors.magenta('Finished extending jshint rule with common jshint JSON'));
      defer.resolve();
      });
    } else {
      defer.resolve();
      $.util.log($.util.colors.red('No new jshint rule'));
    }
  } else {
    defer.reject();
  }

  return defer.promise;
});

gulp.task('extendEslint', function () {
  var defer = q.defer();
  var isFile = false;
  try {
    isFile = fs.statSync('./.eslintrc').isFile();
  } catch (e) {
    isFile = false;
  }

  if(isFile) {
    var eslintJson = JSON.parse(fs.readFileSync('./.eslintrc').toString());
    var originalEslintJson = JSON.parse(JSON.stringify(eslintJson));
    if(extendEshintJson) {
      for(var key in extendEshintJson) {
        eslintJson[key] = extendEshintJson[key];
      }
    }
    if(!_.isEqual(originalEslintJson, eslintJson)) {
      fs.writeFile(eslintJSONPath, JSON.stringify(eslintJson, null, 2), function (err, data) {
        if(err) {
          throw err;
        }
        $.util.log($.util.colors.magenta('Finished extending jshint rule with common jshint JSON'));
      defer.resolve();
      });
    } else {
      defer.resolve();
      $.util.log($.util.colors.red('No new jshint rule'));
    }

  } else {
    defer.reject();
  }

  return defer.promise;
});
