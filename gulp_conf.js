'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var _ = require('lodash');
var gUtil = require('gulp-util');

var appName = require('./../package.json').name;
var commonRoot = 'src-common';
var tmp = '.tmp';
var dist = 'dist';
var webDist = 'web-dist';
var isProd = false;
var hgBranch = null;

exports.appName = appName;
exports.apps = require('./tkg-apps').apps;

exports.isEs6 = function (path) {
  var hasEs6IndexModule = false;
  try {
    hasEs6IndexModule = fs.statSync(path + '/index.module.js').isFile();
  } catch (e) {
    hasEs6IndexModule = false;
  }

  return hasEs6IndexModule;
};

var paths = {
  common: {
    root: commonRoot,
    src: commonRoot + '/scripts',
    srcEs6: commonRoot + '/scripts-es6',
    srcDist: path.join(tmp, '/serve/common'),
    tmplDist: path.join(tmp, '/serve/common/template')
  },
  app: {
    src: 'src',
    dist: dist,
    tmp: tmp,
    srcDist: path.join(tmp, '/serve/app'),
    tmplDist: path.join(tmp, '/serve/app/template'),
    e2e: 'e2e'
  },
  webDist: {
    root: webDist
  }
};

exports.paths = paths;

exports.getDependentPaths = function (module) {
  return {
    root: 'src-' + module,
    src: 'src-' + module + '/src',
    srcDist: path.join(tmp, '/serve/', module),
    tmplDist: path.join(tmp, '/serve/', module, '/template')
  };
};

exports.getDependencies = function () {
  var file_path = './tkg-config/tkg_dependencies.json';
  if(this.alertWrongPaths(file_path)) {
    return [];
  }
  var dependencies = JSON.parse(fs.readFileSync(file_path).toString());
  return dependencies;
};

exports.alertWrongPaths = function (paths, returnWrongPaths, skipLog) {
  paths = _.isArray(paths) ? paths : [paths]
  var wrongPaths = [];
  _.forEach(paths, function (path) {
    var hasMinimap = /{/.test(path);
    var path = hasMinimap ? path.substring(0, path.indexOf('{')) : path;
    try {
      var isDirectory = fs.statSync(path).isDirectory();
      var isFile = fs.statSync(path).isFile();
      if(!isDirectory && !isFile) {
        wrongPaths.push(path);
      }
    } catch (e) {
      wrongPaths.push(path);
    }
  });

  if(wrongPaths.length) {
    if(returnWrongPaths) {
      return wrongPaths;
    }
    if(!skipLog) {
      gUtil.log(gUtil.colors.red('The following paths don\'t exist'));
      gUtil.log(gUtil.colors.red(wrongPaths));
    }
    return true;
  }
  if(returnWrongPaths) {
    return wrongPaths;
  }
  return false;
};

/**
 * Inject bower dependencies
 */
exports.wiredep = {
  exclude: [/bootstrap.js$/, /bootstrap-sass-official\/.*\.js/, /bootstrap\.css/],
  directory: 'bower_components'
};

exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

exports.setProd = function () {
  isProd = true;
};

exports.isProd = function () {
  return isProd;
};

exports.setHgBranch = function (branch) {
  hgBranch = branch;
};

exports.getHgBranch= function () {
  return hgBranch;
};

