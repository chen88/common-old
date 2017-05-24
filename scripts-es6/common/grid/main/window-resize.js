$(document).ready(function () {
  var bodyEle = $('body');
  var timeoutId;
  $(window).on('resize', function () {
    if(!bodyEle.hasClass('resizing')) {
      bodyEle.addClass('resizing');
    }
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(function () {
      if((bodyEle).hasClass('resizing')) {
        bodyEle.removeClass('resizing');
      }
    }, 500);
  })
});

export function primaryBody () {
  return {
    restrict: 'A',
    scope: false,
    priority: 1,
    link: function ($scope, element) {

      function getBodyHeight () {
        return window.innerHeight - tkgConst.size.header;
      }

      function resize () {
        element.css({
          height: getBodyHeight()
        });
      }

      tkgConst.prepareWindowEvents($scope, resize);
    }
  };
}

export function primaryGrid () {
  return {
    restrict: 'A',
    scope: false,
    priority: 1,
    link: function ($scope, element) {

      function getBodyHeight () {
        return window.innerHeight - tkgConst.size.header;
      }

      function resize () {
        element.css({
          height: getBodyHeight()
        });
      }

      tkgConst.prepareWindowEvents($scope, resize);
    }
  };
}

export function secondaryBody () {
  return {
    restrict: 'A',
    scope: false,
    priority: 1,
    link: function ($scope, element, attrs, ctrl) {

      function getBodyHeight () {
        return window.innerHeight - tkgConst.size.header;
      }

      function resize () {
        element.css({
          height: getBodyHeight()
        });
      }

      tkgConst.prepareWindowEvents($scope, resize)
    }
  };
}

export function secondaryGrid () {
  return {
    restrict: 'E',
    scope: false,
    priority: 1,
    require: '^secondaryBody',
    link: function ($scope, element, attrs, ctrl) {
      var getBodyWidth = ctrl.getBodyWidth
      var getBodyHeight = ctrl.getBodyHeight;
      var delay = tkgConst.timeout.setSecondaryGrid;
      var position = attrs.position;
      var nonResizeGrid;
      var resizedGrid;
      var counter;
      var resize;
      var panelHeading = tkgConst.size.panelHeading;

      function getFixedElementHeight () {
        nonResizeGrid = nonResizeGrid || _.find(ctrl.gridSystem, {isFixed: true});
        resizedGrid = resizedGrid || _.find(ctrl.gridSystem, {isFixed: false});
        return nonResizeGrid.element.height();
      }

      function horizontalResize () {
        element.css({
          width: getBodyWidth()
        });
      }

      function verticalResize () {
        var newHeight = getBodyHeight() - getFixedElementHeight();
        element.css({
          height: newHeight
        });
        _.find(ctrl.gridSystem, {position: position}).height = newHeight;
        handleMinimizePanel();
      }

      function handleMinimizePanel () {
        var minimizedGrid = _.find(ctrl.gridSystem, {isMinimized: true});
        if(minimizedGrid) {
          $scope.gridRules.hasMinimizedPanel = true;
          var nonMinimizedGrid = _.find(ctrl.gridSystem, function (grid) {return !grid.isMinimized});
          var newHeight = getBodyHeight() - panelHeading;

          minimizedGrid.element.css({
            height: panelHeading
          });
          minimizedGrid.height = panelHeading;

          nonMinimizedGrid.element.css({
            height: newHeight
          });
          nonMinimizedGrid.height = newHeight;
        } else {
          $scope.gridRules.hasMinimizedPanel = false;
        }
      }

      /** Only resize horizontally if the secondary grid's resize isn't true **/
      if(attrs.resize !== 'true')  {
        resize = function () {
          window.clearTimeout(counter);
          counter = window.setTimeout(function () {
            horizontalResize();
          }, delay);
        }
      } else {
        resize = function () {
          window.clearTimeout(counter);
          counter = window.setTimeout(function () {
            horizontalResize();
            verticalResize();
          }, delay);
        }
      }

      tkgConst.prepareWindowEvents($scope, resize)
    }
  };
}

export function tiertaryBody () {
  return {
    restrict: 'A',
    scope: false,
    priority: 1,
    link: function ($scope, element, attrs, ctrl) {
      var delay = tkgConst.timeout.setSecondaryGrid;
      var counter;

      function resize () {
        window.clearTimeout(counter);
        counter = window.setTimeout(function () {
          if($scope.gridRules.hasMinimizedPanel) {
            $scope.setTiertaryGridSize();
            $scope.$broadcast('manualResized');
          }
        }, delay);
      }

      tkgConst.prepareWindowEvents($scope, resize);
    }
  };
}

export function tiertaryGrid () {
  return {
    restrict: 'E',
    scope: false,
    priority: 1,
    require: '^tiertaryBody',
    link: function ($scope, element, attrs, ctrl) {
      if(attrs.resize !== 'true')  {
        return;
      }

      var fixedGrid = _.find(ctrl.gridSystem, {isFixed: true});
      var getBodyWidth = ctrl.getBodyWidth;
      var counter;

      function resize () {
        window.clearTimeout(counter);
        counter = window.setTimeout(function () {
          element.css({
            width: getBodyWidth() - fixedGrid.width,
          });
        }, tkgConst.timeout.setTiertaryGrid);
      }

      tkgConst.prepareWindowEvents($scope, resize);
    }
  };
}

export function resizeBar () {
  return {
    restrict: 'E',
    scope: false,
    priority: 1,
    link: function ($scope, element, attrs) {
      var prevElement = attrs.prevElement ? $(attrs.prevElement) : element.prev();
      var nextElement = attrs.nextElement ? $(attrs.nextElement) : element.next();
      var bar = element.children();
      var position = attrs.position;
      var offset = tkgConst.size.primaryBorder/2;
      var delay = tkgConst.timeout.setResizeBar;
      var counter;

      function setNewPosition () {
        if(position === 'vertical') {
          bar.css({
            left: prevElement.width() - offset
          });
        } else {
          bar.css({
            top: prevElement.height() + offset
          });
        }
      }

      function resize () {
        window.clearTimeout(counter);
        counter = window.setTimeout(setNewPosition, delay);
      }

      tkgConst.prepareWindowEvents($scope, resize);
    }
  };
}

export function tkgMaxed () {
  return {
    restrict: 'C',
    scope: false,
    priority: 1,
    link: function ($scope, element, attrs) {
      var headerHeight = tkgConst.size.header;
      function resize () {
        element.css({
          height: window.innerHeight - headerHeight
        });
      }

      tkgConst.prepareWindowEvents($scope, resize)
    }
  };
}

export function highchartResizeHandler () {
  return {
    restrict: 'A',
    priority: 1,
    link: function ($scope, element, attrs) {
      tkgConst.prepareWindowEvents($scope, function () {
        $scope.$apply($scope.setChartSize);
      });
    }
  }
}