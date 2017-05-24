#### Some Gulp Configuration needs to take note of

```
// Refresh the css files
gulp.watch([
    path.join(conf.paths.baseTmp, '/serve/app/{,*/,*/*/}*.css')
  ], function (event) {
    if(event.type === 'changed') {
      browserSync.reload('*.css');
    }
});
```

```
// Any pages made to css, do not refresh the page
.pipe(browserSync.stream({match: ['*.css', '**/*.css']}));
```