## `<tgk-grid></tkg-grid>`

### 1. `tkgConfig.setGridTemplate(Object gridTemplate)`

```
gridTemplate = {
	primaryLeftGrid:
	secondaryTopGrid:
	tiertaryLeftGrid:
	tiertaryRightGrid:
}

|-------|
|  |    |
|  |----|
|--|----|
```

#### 2. `tkgConfig.setGridTemplate(Object gridTemplate)`
```
gridTemplate = {
	topLeft:
	secondaryTopGrid:
	bottomLeft:
	bottomRight:
}

|---------|
|___|_____|
|   |     |
|---|-----|

```

## `<tkg-one-grid></tkg-one-grid>`
### 1. `tkgConfig.setOneGrid(String gridTemplate)`
```
gridTemplate = 'pathToTemplate.html'

|----------|
|          |
|          |
|----------|
```

## `<tkg-single-grid></tkg-single-grid>`
### 1. `tkgConfig.setGridList(Array gridTemplate)`
```
gridTemplate = [
  pathToTemplate1.html,
  pathToTemplate2.html
]
gridTemplate = [
  { template: pathToTemplate1.html, height: '30%'},
  { template: pathToTemplate2.html, height: '40%'}
]

|----------|
|          |
|----------|      
|          |
|----------|
|          |
|----------|
```

## `<tkg-two-grids></tkg-two-grids>`
### 1. `tkgConfig.setGridList(Array gridTemplate)`
```
gridTemplate = [
  pathToLeftGrid.html,
  pathToRightGrid1.html,
  pathToRightGrid2.html
]

|-----------|
|   |-------|
|   |-------|
|   |-------|
|-----------|
```

## `<tkg-horizontal-single-grid></tkg-horizontal-single-grid>`
### 1. `tkgConfig.setHGridList(Array gridTemplate)`
```
gridTemplate = [
  pathToTemplate1.html,
  pathToTemplate2.html

]

|--|--|--|
|  |  |  |
|  |  |  |
|--|--|--|
```

## `<tkg-horizontal-single-grid-addon></tkg-horizontal-single-grid-addon>`
### 1. `tkgConfig.setHGridList(Array gridTemplate)`
```
gridTemplate = [
  pathToAddonTemplate.html,
  pathToTemplate2.html
]

|--------|
|--------|
|  |  |  |
|--|--|--|
```

## `<tkg-horizontal-parallel-grid-addon></tkg-horizontal-parallel-grid-addon>`

### 1. `tkgConfig.setHParallelGridList(Object gridTemplate)`
```
gridTemplate = {
	top: [
      'pathToTopTemplate1.html',
      'pathToTopTemplate2.html'
    ],
    bottom: [
      'pathToBottomTemplate1.html',
      'pathToBottomTemplate2.html'
    ]
}

|--------|
|  |  |  |
|--------|
|  |  |  |
|--|--|--|
```

## `tkg-horizontal-grid(from="position1")`
### 1. `tkgConfig.setHGridListObj(Object gridTemplate)` 
generate horizontal grid list based on the `from` attribute. Good to pair with `tkg-single-grid`

```
gridTemplate = {
	position1: [
      'pathToTopTemplate1.html',
      'pathToTopTemplate2.html'
    ],
    position2: [
      'pathToBottomTemplate1.html',
      'pathToBottomTemplate2.html'
    ]
};
Or 
gridTemplate = {
	position1: [
      {template: 'pathToTopTemplate1.html', width: 350},
      'pathToTopTemplate2.html'
    ],
    position2: [
      'pathToBottomTemplate1.html',
      'pathToBottomTemplate2.html'
    ]
};

|--|--|--|
|--|--|--|

```