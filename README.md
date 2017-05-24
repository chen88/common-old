## Install

- Add the following script to `package.json`

	```
	  "scripts": {
	    "postinstall": "node ./postInstall.js"
	  }
	```


- Install the following node packages in order to unpackage common web modules

	```
	npm install gulp-shell --save-dev
	npm install gulp-git --save-dev
	npm install gulp-install --save-dev
	npm install lodash --save-dev
	npm install q --save-dev
	```

#### Setting up Common modules
In gulpfile.js, add the following before `wrench.readdirSyncRecursive('./gulp').filter(function(file) `


```
//add this
var appGulpTasks = './src-common/gulp';
wrench.readdirSyncRecursive(appGulpTasks).filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require(appGulpTasks + '/' + file);
});

var appGulpTasks = './src-common/gulp/server';
wrench.readdirSyncRecursive(appGulpTasks).filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require(appGulpTasks + '/' + file);
});

var configGulpTasks = './src-common/gulp-proj-config';
wrench.readdirSyncRecursive(configGulpTasks).filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require(configGulpTasks + '/' + file);
});
```
and remove the following 

```
//remove this
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});
```

#### Structural Yield
```
root/
|-- bower_components/
|-- gulp/
|
|-- src/
|   |-- app/
|   |   |-- {modules}/
|   |   |   |-- {appName_module}.{js}
|   |-- styles/
|   |   |-- {modules}/
|   |   |   |-- {appName_module}.{scss}
|   |-- assets/
|   |   |-- images/
|
|-- src-common/
|   |-- gulp/
|   |   |-- {gulpTasks}.js
|   |-- config/
|   |   |-- tkg_dependencies.json
|   |-- scripts/
|   |   |-- {modules}/
|   |   |   |-- {appName_module}.{js}
|   |-- scripts-es6/
|   |   |-- {modules}/
|   |   |   |-- {appName_module}.{js}
|   |-- styles/
|   |   |-- {modules}/
|   |   |   |-- {appName_module}.{scss}
|   |-- images/
|
|-- otherAppDependencies/  //{src-ranger, src-g18}
|   |-- src/
|-- web-dist/
|   |-- Deployment Files //same as dist folder with additional mercurial setting to deploy
```
