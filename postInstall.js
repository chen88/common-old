'use strict';

let fs = require('fs');
let path = require('path');
let appPath = path.join('./src-common/.git');
var gulp = require('gulp');
let $ = require('gulp-load-plugins')();
try {
  fs.statSync(appPath).isDirectory();
} catch (e) {
  $.git.clone('git@git.tkginternal.com:commons/web.git', {args: './src-common'}, (err) => {
    if(err) {
      $.util.log($.util.colors.red('failed to clone common'));
      $.util.log($.util.colors.red(err));
    } else {
      $.util.log($.util.colors.cyan('initializing project'));

      try {
        let isDirectory = fs.statSync('./.git').isDirectory();
        if(!isDirectory) {
          git.init(() => {
            $.git.addSubmodule('git@git.tkginternal.com:commons/web.git', './src-common', {args: '-f'});
          });
        }
      } catch (e) {
        git.init(() => {
          $.git.addSubmodule('git@git.tkginternal.com:commons/web.git', './src-common', {args: '-f'});
        });
      }
      setTimeout(function () {
          gulp.src('./')
            .pipe($.shell([
              'gulp init'
            ], {
              // quiet: true
            }));
      }, 1000);
    }
  });
}
