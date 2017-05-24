angular.module('tkgCommon')
.directive('tkgSingleGrid', function (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/single-grid/single-grid.html',
    link: function ($scope, element, attrs) {
      var templates = tkgConfig.getGridList();
      $scope.gridTemplate = templates;
    }
  };
})
.directive('singleGrid', function ($timeout, prepareWindowEvents) {
  return {
    restrict: 'C',
    link: function ($scope, element, attrs) {
      let templateDelay = tkgConst.timeout.singleGrid;
      let resizeDelay = tkgConst.timeout.setPrimaryGrid;
      let borderSize = tkgConst.size.singleGridBorder;
      let autoAdjustLastChild;
      let childPanel;
      let counter;

      window.setTimeout(function () {
        childPanel = element.find('div.single-grid-children');
        autoAdjustLastChild = _.last($scope.gridTemplate).autoAdjust;
        adjustLastChildHeighht();
        $scope.$broadcast('manualResized');
      }, templateDelay);

      function adjustLastChildHeighht () {
        window.clearTimeout(counter);
        // $timeout.cancel(counter);
        // $timeout(function () {
        counter = window.setTimeout(function () {
          var elementHeight = element.height();
          var totalChildPanelHeight = 0;
          var lastChildHeight = 0;
          childPanel.each(function (i, child) {
            child = $(child);

            totalChildPanelHeight += child.height();
            if(i === childPanel.length - 1) {
              lastChildHeight = child.height();
            }
          });

          if(totalChildPanelHeight < elementHeight || autoAdjustLastChild) {
            var lastChildFinalHeight = lastChildHeight + elementHeight - totalChildPanelHeight - borderSize - childPanel.length
            childPanel.last().height(lastChildFinalHeight);
          } else {
            $scope.scrollSingleGrid = true;
          }
        }, resizeDelay);
      }

      prepareWindowEvents($scope, adjustLastChildHeighht);
    }
  };
})
/**
 * [singleGridChildren ]
 *   -  expect the child template is composed of a panel
 */
.directive('singleGridChildren', function ($animate, $rootScope, $interpolate, prepareWindowEvents) {
  return {
    restrict: 'A',
    priority: 0,
    controller: angular.noop,
    controllerAs: 'singleGridChildren',
    link: function ($scope, element, attrs, ctrl) {
      if(!tkgConst.singleGrid.minimizable) {
        return;
      }
      var delay = tkgConst.timeout.modifyColumn;
      var heightDelay = tkgConst.timeout.singleGridChild;
      var paddingSize = tkgConst.size.verticalCellPadding;
      var gridHeight = attrs.height ? $interpolate(attrs.height)($scope) : null;
      var parentEle = element.parents('.single-grid');
      var counter;

      ctrl.collapsed = true;

      function activateResize () {
        window.setTimeout(function () {
          if(!$scope.$$phase) {
            $scope.$apply(function () {
              $rootScope.$broadcast('manualResized');
              $rootScope.$broadcast('panelMinimized');
            });
          } else {
            $rootScope.$broadcast('manualResized');
            $rootScope.$broadcast('panelMinimized');
          }
        }, delay);
      }

      function collapse () {
        $animate.addClass(element, 'grid-collapsed').then(activateResize);
        // element.addClass('grid-collapsed');
      }

      function expand () {
        $animate.removeClass(element, 'grid-collapsed').then(activateResize);
        // element.removeClass('grid-collapsed');
      }

      function triggerMinimizeSingleGrid (collapsed) {
        if(collapsed) {
          expand();
        } else {
          collapse();
        }
      };
      ctrl.triggerMinimizeSingleGrid = triggerMinimizeSingleGrid;

      $scope.$watch('singleGridChildren.collapsed', triggerMinimizeSingleGrid);

      function adjustHeight () {
        window.clearTimeout(counter);
        counter = window.setTimeout(function () {
          var parentHeight = parentEle.height();
          var height = parentHeight * gridHeight - paddingSize;
          element.height(height);
        });
      }

      if(gridHeight)  {
        if(/%/.test(gridHeight)) {
          gridHeight = parseFloat(gridHeight)/100;
          prepareWindowEvents($scope, adjustHeight);
          setTimeout(function () {
            adjustHeight();
          }, 200);
        } else {
          element.height(gridHeight);
        }
      }


    }
  };
})
.directive('singleGridMinimizer', function ($parse) {
  return {
    restrict: 'E',
    template: '<i class="pull-right fa" ng-class="{\'fa-plus\': !singleGridChildren.collapsed, \'fa-minus\': singleGridChildren.collapsed}" ></i>',
    link: function ($scope, element, attrs) {

      if(tkgConst.isMaximized()) {
        element.hide();
        return;
      }

      var watchElement = attrs.isOpen;

      tkgConst.bindEvent(element, 'click', function (e) {
        $scope.singleGridChildren.collapsed = !$scope.singleGridChildren.collapsed;
        if(watchElement) {
          $parse(attrs.isOpen).assign($scope, $scope.singleGridChildren.collapsed);
        }
        // $scope.triggerMinimizeSingleGrid();
      }, $scope);

      $scope.$watch(attrs.isOpen, function (collapsed) {
        if(typeof(collapsed) === 'boolean') {
          $scope.singleGridChildren.collapsed = collapsed;
          setTimeout(function () {
            $(window).resize();
          });
        }
      });
    }
  }
})
.directive('singleGridMaximizer', ($rootScope) => {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/single-grid/single-grid-maximizer.html',
    link: ($scope, element, attrs) => {
      $scope.usePlus = attrs.usePlus === 'true';
      let ctrl = $scope.singleGridChildren;
      ctrl.maximized = false;
      tkgConst.bindEvent(element, 'click', () => {
        ctrl.maximized = !ctrl.maximized;
        $rootScope.$broadcast('manualResized');
      }, $scope);
      element.addClass('pull-right');
    }
  };
});
