import * as hGrid from './horizontal-grids/horizontal-grid';
import * as vGrid from './vertical-grids/vertical-grid';
import * as body from './main/body';
import * as windowResize from './main/window-resize';
import {highchartResizeHandler} from './main/highchart-resize-handler';
import {tkgMaximize} from './main/maximize';
import {resizeBar} from './main/manual-resize';
import {tkgTwoGrids} from './two-grids/two-grids';
import {tkgThreeGrids} from './three-grids/three-grids';
import {tkgOneGrid} from './one-grid/one-grid';
import * as hSingleGrid from './horizontal-single-grid/horizontal-single-grid';
export let tkgGridModule = 'tkgGridModule';

angular.module(tkgGridModule, [])
  .directive('resizeBar', resizeBar)
  .directive('highchartResizeHandler', highchartResizeHandler)
  .directive('tkgMaximize', tkgMaximize)
  .directive('tkgGrid', body.tkgGrid)
  .directive('primaryBody', body.primaryBody)
  .directive('primaryGrid', body.primaryGrid)
  .directive('secondaryBody', body.secondaryBody)
  .directive('secondaryGrid', body.secondaryGrid)
  .directive('tiertaryBody', body.tiertaryBody)
  .directive('tiertaryGrid', body.tiertaryGrid)

  .directive('secondaryBody', windowResize.secondaryBody)
  .directive('secondaryGrid', windowResize.secondaryGrid)
  .directive('tiertaryBody', windowResize.tiertaryBody)
  .directive('tiertaryGrid', windowResize.tiertaryGrid)
  .directive('resizeBar', windowResize.resizeBar)
  .directive('tkgMaxed', windowResize.tkgMaxed)

  .directive('tkgOneGrid', tkgOneGrid)
  .directive('tkgTwoGrids', tkgTwoGrids)
  .directive('tkgThreeGrids', tkgThreeGrids)

  .directive('tkgHorizontalSingleGrid', hSingleGrid.tkgHorizontalSingleGrid)
  .directive('horizontalGridBody', hSingleGrid.horizontalGridBody)
  .directive('tkgHorizontalSingleGridAddon', hSingleGrid.tkgHorizontalSingleGridAddon)
  .directive('tkgHorizontalParallelGrid', hSingleGrid.tkgHorizontalParallelGrid)
  .directive('tkgHorizontalGrid', hSingleGrid.tkgHorizontalGrid)

  .directive('highchartResizeHandler', windowResize.highchartResizeHandler)
  .directive('horizontalGrid', hGrid.horizontalGrid)
  .directive('hGridChildren', hGrid.hGridChildren)
  .directive('gridHorizontalResizer', hGrid.gridHorizontalResizer)
  .directive('verticalGrid', vGrid.verticalGrid)
  .directive('vGridChildren', vGrid.vGridChildren)
  .directive('vGridMinimizer', vGrid.vGridMinimizer)
  .directive('vGridMaximizer', vGrid.vGridMaximizer)
  .directive('gridVerticalResizer', vGrid.gridVerticalResizer);