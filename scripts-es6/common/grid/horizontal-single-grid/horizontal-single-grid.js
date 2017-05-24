export function tkgHorizontalSingleGrid (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/horizontal-single-grid/horizontal-single-grid.html',
    link: function ($scope, element, attrs) {
      $scope.disableResizer = attrs.disableResizer === 'true';
      var templates = tkgConfig.getHGridList();
      $scope.hGridTemplate = templates;
    }
  };
}

export function horizontalGridBody () {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      var resizeDelay = tkgConst.timeout.singleGrid
      var counter;
      var manualResizeCounter;
      var childPanels;
      var fixedChildPanels;
      var fixedPanelInitialized = false;
      var nonFixedChildPanels;
      var totalChild;
      var minimumGridSize = tkgConst.size.minimumGridSize;
      var offset = tkgConst.size.primaryBorder;
      var panelBorder = tkgConst.size.panelBorder;
      var scrollbar = tkgConst.size.scrollbar;
      var panelWidth;
      var fixedPanelTotalWidth = 0;
      var parentEle;

      function getWindowWidth () {
        var parentEle = parentEle || element.parents('tkg-horizontal-grid').parent('.single-grid-children');
        if(parentEle.length) {
          return parentEle.width();
        }
        return window.innerWidth - offset * 2;
      }

      function adjustChildWidth () {
        childPanels = childPanels || element.children('.panel-children');
        fixedChildPanels = fixedChildPanels || element.children('[is-fixed="true"]');
        nonFixedChildPanels = nonFixedChildPanels || element.children('[is-fixed="false"]');
        totalChild = totalChild || childPanels.length;
        if(childPanels.length === 2) {
          element.parents('.horizontal-grid-panel').addClass('two-children');
        }

        var windowWidth = getWindowWidth();
        var extraReduction = $scope.scrollSingleGrid ? scrollbar : 0;
        extraReduction = 0;
        panelWidth = (windowWidth - extraReduction) / totalChild;

        if(!fixedChildPanels.length) {
          if(panelWidth > minimumGridSize) {
            childPanels.css({
              width: panelWidth
            });
          } else {
            panelWidth = minimumGridSize;
            childPanels.css({
              width: minimumGridSize
            });
          }
        } else {
          var remainingSpace = getWindowWidth() - fixedPanelTotalWidth;
          var nonFixedPanelWidth = (remainingSpace - extraReduction) / nonFixedChildPanels.length;
          nonFixedChildPanels.each(function () {
            var e = $(this);
            e.css({
              width: nonFixedPanelWidth + 'px'
            });
          });
        }
      }

      function adjustFixedChildWidth (extraDelay) {
        if(!fixedPanelInitialized) {
          setTimeout(function () {
            fixedChildPanels = fixedChildPanels || element.children('[is-fixed="true"]');
            nonFixedChildPanels = nonFixedChildPanels || element.children('[is-fixed="false"]');
            fixedPanelInitialized = true;
            fixedPanelTotalWidth = 0;
            fixedChildPanels.each(function () {
              var e = $(this);
              var maxWidth = e.attr('max-width');
              if(maxWidth) {
                e.css({
                  width: maxWidth + 'px'
                });
                fixedPanelTotalWidth += parseInt(maxWidth);
              }
            });
          }, resizeDelay + extraDelay);
        }
      }

      function resize (extraDelay) {
        extraDelay = extraDelay || 0;
        window.clearTimeout(counter);
        counter = window.setTimeout(function () {
          adjustChildWidth();
          var elementWidth = element.width();
          var minimumThreshold = totalChild * minimumGridSize;
          var extraReduction = $scope.scrollSingleGrid ? scrollbar : 0;
          extraReduction = 0;
          if((elementWidth < window.innerWidth && window.innerWidth > minimumThreshold) || elementWidth - 1 > minimumThreshold) {
            element.css({
              width: (panelWidth * totalChild) //+ offset * 2
            });
          } else if (elementWidth < totalChild * minimumGridSize) {
            element.css({
              width: minimumThreshold
            });
          }
        }, resizeDelay + extraDelay);
      }

      tkgConst.prepareWindowEvents($scope, resize);

      adjustFixedChildWidth(35);
      resize(50);

      $scope.$on('manualResized', resize);

    }
  };
}

export function tkgHorizontalSingleGridAddon (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/horizontal-single-grid/horizontal-single-grid-add-on-panel.html',
    link: function ($scope, element, attrs) {
      var templates = angular.copy(tkgConfig.getHGridList());
      var addOnTemplate = templates.shift();
      $scope.hGridTemplate = templates;
      $scope.addOnTemplate = addOnTemplate;
    }
  };
}

export function tkgHorizontalParallelGrid (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/horizontal-single-grid/horizontal-parallel-grid.html',
    link: function ($scope, element, attrs) {
      var templates = angular.copy(tkgConfig.getHParallelGridList());
      $scope.hParallelTemplates = templates;
    }
  };
}

export function tkgHorizontalGrid (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/horizontal-single-grid/horizontal-grid.html',
    link: function ($scope, element, attrs) {
      var templates = angular.copy(tkgConfig.getHGridListObj())[attrs.from];
      $scope.hGridTemplate = templates;
    }
  };
}