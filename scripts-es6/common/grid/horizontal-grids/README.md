## Horizontal Grid

#### Description
horizontal list of panels that can have their width be resizable.

#### Visual 
```
|--|--|--|
|  |  |  |
|  |  |  |
|--|--|--|
```

#### Usage

```
//jade, pug
horizontal-grid(from="grid")
```

```
//javascript

// setting list of templates
tkgConfig.setHGridListObj({
	grid: [
	  'nms605/nms-stat/views/stat-table.html',
	  {template: 'nms605/nms-stat/views/execution.html', width: 0, id: 'execution'},
	]
});

// modifying template width
tkgConfig.setHGridSize({
	id: 'execution',
	width: 400
});

// getting templates
tkgConfig.getHGridListObj();
```
