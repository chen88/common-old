//Array of functions
var primaryGridExecutions = []
  , secondaryGridExecutions = []
  , tiertaryGridExecutions = []
  ;

function resetPrimaryGridSize (horizontalDifference) {
  // var executions = [];
  // executions.push.apply(executions, primaryGridExecutions, secondaryGridExecutions, tiertaryGridExecutions)
  var executions = primaryGridExecutions
                    .concat(secondaryGridExecutions)
                    .concat(tiertaryGridExecutions);

  _.forEach(executions, function (func) {
    func(horizontalDifference);
  });
}

function resetSecondaryGridSize () {
  var executions = secondaryGridExecutions.concat(tiertaryGridExecutions);
  _.forEach(executions, function (func) {
    func();
  });
}

function resetTiertaryGridSize () {
  _.forEach(tiertaryGridExecutions, function (func) {
    func();
  });
}

export function tkgGrid (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/main/grid.html',
    link: function () {
      a.$rootScope.gridTemplate = tkgConfig.getGridTemplate();
    }
  };
}

export function primaryBody () {
  return {
    restrict: 'A',
    scope: false,
    controller: function ($scope) {
      var reduction = $scope.isIntegrated ? tkgConst.size.tableHead : 0;
      this.gridSystem = [];
      $scope.gridRules = {};

      this.getBodyHeight = function () {
        return window.innerHeight - tkgConst.size.header - reduction;
      }
    },
    link: function ($scope, element, attrs, ctrl) {
      element.css({
        height: ctrl.getBodyHeight()
      });
    }
  };
}

  /**
   * primary-grid
   *   - initialize the size and the position of the primary grids
   */
export function primaryGrid () {
  return {
    restrict: 'E',
    scope: true,
    priority: 0,
    require: '^primaryBody',
    link: function ($scope, element, attrs, ctrl) {
      var isLeft = false, leftGrid, rightGrid;

      function setLeftGrid () {
        var width = parseInt(attrs.width) || tkgConst.size.primaryLeftGrid;
        if(/%$/.test(width)) {
          width = window.innerWidth * parseInt(width)/100;
        }
        ctrl.gridSystem.push({
          position: 'left',
          width: width,
          isFixed: attrs.resize !== 'true' ? true : false
        });
      }

      function setRightGrid (width) {
        ctrl.gridSystem.push({
          position: 'right',
          width: width,
          isFixed: attrs.resize !== 'true' ? true : false
        });
      }

      if(attrs.position === 'left') {
        isLeft = true;
        setLeftGrid();
      }

      function setLeftGridSize () {
        window.setTimeout(function () {
          leftGrid = _.find(ctrl.gridSystem, {position: 'left'});
          element.css({
            width: leftGrid.width
          });
        }, tkgConst.timeout.setPrimaryGrid);
      }

      function setRightGridSize () {
        window.setTimeout(function () {
          leftGrid = _.find(ctrl.gridSystem, {position: 'left'});
          // var offset = leftGrid.width + tkgConst.size.primaryBorder;
          var offset = leftGrid.width;
          var width = window.innerWidth - offset;
          element.css({
            left: offset + 'px',
            width: width,
          });
          setRightGrid(width);
        }, tkgConst.timeout.setPrimaryGrid);
      }

      /** For Left Grid Only **/
      function resetGridSize (newWidth) {
        leftGrid = _.find(ctrl.gridSystem, {position: 'left'});
        leftGrid.width = newWidth;
      }

      /** Left grid **/
      if(isLeft) {
        setLeftGridSize();
        primaryGridExecutions.push(setLeftGridSize);
        /** Shared scope functions to reset the grid size to a new size **/
        $scope.resetGridSize = function (newWidth, horizontalDifference) {
          resetGridSize(newWidth);
          resetPrimaryGridSize(horizontalDifference);
        };
      }
      /** Right grid **/
      else {
        setRightGridSize();
        primaryGridExecutions.push(setRightGridSize);
      }
    }
  };
}

export function secondaryBody () {
  return {
    restrict: 'A',
    scope: false,
    priority: 0,
    controller: function ($scope, $element) {
      this.gridSystem = [];
      this.getBodyHeight = function () {
        return $element.height();
      }
      this.getBodyWidth = function () {
        return $element.width();
      }
      this.secondaryBody = $element;

      $scope.toggleMinimize = function (grid, isCollapse) {
        $scope.$broadcast('panelMinimized', grid, isCollapse);
        resetTiertaryGridSize();
      };
    },
    link: function ($scope, element, attrs, ctrl) {
      var getBodyHeight = ctrl.getBodyHeight;

      element.css({
        height: window.innerHeight - tkgConst.size.header
      });
    }
  };
}

export function secondaryGrid () {
  return {
    restrict: 'E',
    scope: true,
    priority: 0,
    require: '^secondaryBody',
    link: function ($scope, element, attrs, ctrl) {
      var isTop = false
        , height = attrs.height
        , offset = tkgConst.size.primaryBorder
        , panelHeading = tkgConst.size.panelHeading
        , position = attrs.position
        ;

      /** If attrs.height is in percentage, calculate it relative to the parent height **/
      function calculateInitialHeight () {
        if(/%/.test(height)) {
          height = ctrl.getBodyHeight() * parseInt(height)/100
        }
        return height;
      }

      function setTopGrid () {
        window.setTimeout(function () {
          ctrl.gridSystem.push({
            position: 'top',
            height: calculateInitialHeight(),
            isFixed: attrs.resize !== 'true' ? true : false,
            element: element
          });
        }, tkgConst.timeout.setSecondaryGrid);
      }

      function setBottomGrid () {
        window.setTimeout(function () {
          ctrl.gridSystem.push({
            position: 'bottom',
            height: calculateInitialHeight(),
            isFixed: attrs.resize !== 'true' ? true : false,
            element: element
          });
        }, tkgConst.timeout.setSecondaryGrid)
      }

      function setTopGridSize () {
        window.setTimeout(function () {
          var topGrid = _.find(ctrl.gridSystem, {position: 'top'});
          element.css({
            height: topGrid.height,
            width: ctrl.getBodyWidth(),
          });
        }, tkgConst.timeout.setSecondaryGrid);
      }

      function setBottomGridSize () {
        window.setTimeout(function () {
          var topGrid = _.find(ctrl.gridSystem, {position: 'top'});
          element.css({
            height: ctrl.getBodyHeight() - topGrid.height,
            width: ctrl.getBodyWidth(),
            bottom: offset
          });
        }, tkgConst.timeout.setSecondaryGrid);
      }

      function minimizeTopGrid () {
        var topGridSystem = _.find(ctrl.gridSystem, {position: 'top'});
        topGridSystem.height = panelHeading;
        topGridSystem.isMinimized = true;
        setTopGridSize();
      }

      function unminimizeTopGrid () {
        var topGridSystem = _.find(ctrl.gridSystem, {position: 'top'});
        topGridSystem.height = calculateInitialHeight();
        topGridSystem.isMinimized = false;
        setTopGridSize();
      }

      function resetGridSize (newHeight) {
        var topGrid = _.find(ctrl.gridSystem, {position: 'top'});
        topGrid.height = newHeight;
      }

      /** Top grid **/
      if(position === 'top') {
        setTopGrid();
        setTopGridSize();
        secondaryGridExecutions.push(setTopGridSize);
        $scope.resetGridSize = function (newHeight) {
          resetGridSize(newHeight);
          resetSecondaryGridSize()
        };

        $scope.$on('panelMinimized', function (e, grid, isCollapse) {
          if(grid === 'topGrid') {
            window.setTimeout(function () {
              if(isCollapse) {
                minimizeTopGrid();
              } else {
                unminimizeTopGrid();
              }
            }, tkgConst.timeout.setSecondaryGrid);
          }
        });
      }
      /** Bottom grid **/
      else {
        setBottomGrid();
        setBottomGridSize();
        secondaryGridExecutions.push(setBottomGridSize);

        $scope.$on('panelMinimized', function (e, grid, isCollapse) {
          if(grid === 'topGrid') {
            setBottomGridSize();
          }
        });
      }

    }
  };
}

export function tiertaryBody () {
  return {
    restrict: 'A',
    scope: true,
    priority: 0,
    controller: function ($scope, $element) {
      this.gridSystem = [];
      this.getBodyHeight = function () {
        return $element.height() - tkgConst.size.panelBorder;
        // return parseInt($element.css('height'));
      }
      this.getBodyWidth = function () {
        return $element.width();
      }
      this.tiertaryBody = $element;

      $scope.setTiertaryGridSize = resetTiertaryGridSize;
    }
  }; 
}

export function tiertaryGrid () {
  return {
    restrict: 'E',
    scope: true,
    priority: 0,
    require: '^tiertaryBody',
    link: function ($scope, element, attrs, ctrl) {
      var isLeft = false, leftGrid, rightGrid;

      function setLeftGrid () {
        ctrl.gridSystem.push({
          position: 'left',
          width: parseInt(attrs.width) || tkgConst.size.tiertaryLeftGrid,
          isFixed: attrs.resize !== 'true' ? true : false
        });
      }

      function setRightGrid (width) {
        ctrl.gridSystem.push({
          position: 'right',
          width: width,
          isFixed: attrs.resize !== 'true' ? true : false
        });
      }

      if(attrs.position === 'left') {
        isLeft = true;
        setLeftGrid();
      }

      function setLeftGridSize () {
        window.setTimeout(function () {
          leftGrid = _.find(ctrl.gridSystem, {position: 'left'});
          element.css({
            width: leftGrid.width,
            height: ctrl.getBodyHeight()
          });
        }, tkgConst.timeout.setTiertaryGrid);
      }

      function setRightGridSize () {
        window.setTimeout(function () {
          leftGrid = _.find(ctrl.gridSystem, {position: 'left'});
          // var offset = leftGrid.width + tkgConst.size.primaryBorder;
          var offset = leftGrid.width;
          var width = ctrl.getBodyWidth() - offset;
          element.css({
            left: offset + 'px',
            width: width,
            height: ctrl.getBodyHeight()
          });
          setRightGrid(width);
        }, tkgConst.timeout.setTiertaryGrid);
      }

      function resetGridSize (newWidth) {
        leftGrid = _.find(ctrl.gridSystem, {position: 'left'});
        leftGrid.width = newWidth;
      }

      /** Left grid **/
      if(isLeft) {
        setLeftGridSize();
        tiertaryGridExecutions.push(setLeftGridSize);
        $scope.$on('panelMinimized', setLeftGridSize);

        $scope.resetGridSize = function (newWidth) {
          resetGridSize(newWidth);
          resetTiertaryGridSize();
        };
      }
      /** Right grid **/
      else {
        setRightGridSize();
        tiertaryGridExecutions.push(setRightGridSize);
        $scope.$on('panelMinimized', setRightGridSize);
      }
    }
  }; 
}