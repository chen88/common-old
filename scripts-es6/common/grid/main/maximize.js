let maximized = false;
export function tkgMaximize ($compile, $rootScope, $timeout) {
  return {
    restrict: 'A',
    scope: false,
    priority: 0,
    link: function ($scope, element, attrs) {
      var body = $('body')
        , maximizedEle = $('#tkg-maximized')
        , maximizedContent = $('#tkg-maximized-content')
        , maximizedContent
        , templateUrl = attrs.tkgMaximize
        , newScope
        , headerHeight = tkgConst.size.header
        , delay = tkgConst.timeout.setResizeBar
        ;

      if(!maximizedEle.length) {
        maximizedEle = $('<div id="tkg-maximized"></div>');
        maximizedContent = $('<div id="tkg-maximized-content"></div>')
        maximizedEle.css({
          top: headerHeight,
        });
        maximizedEle.append(maximizedContent);
        body.append(maximizedEle);
      }

      function maximize () {
        maximizedEle.css({
          height: window.innerHeight - headerHeight
        });
        newScope = $scope.$new();
        newScope.isFromMaximized = true;
        newScope.$on('$destroy', function () {
          $scope.maximized = false;
        });
        newScope.maximized = true;
        maximizedContent.attr('tkg-template-url', templateUrl);
        maximizedEle.addClass('tkg-maxed');
        $compile(maximizedEle)(newScope);
        $rootScope.$broadcast('maximized');
      };

      function minimize (routeChange) {
        $scope.maximized = tkgConst.maximized = false;
        if(!routeChange) {
          $scope.$destroy();
        }
        maximizedContent.html('');
        maximizedEle.removeClass('tkg-maxed');
        $rootScope.$broadcast('minimized');
        maximizedContent.scope().$broadcast('contentMinimized');
      };

      function triggerMaxmization () {
        if(!maximized) {
          maximized = true;
          maximize();
        } else {
          maximized = false;
          minimize();
        }
        $scope.maximized = tkgConst.maximized = maximized;
        $timeout(function () {
          $rootScope.$broadcast('manualResized');
        }, delay);
      };

      element.on('click', function () {
        $scope.$apply(triggerMaxmization);
      });

      $scope.$on('$destroy', function () {
        element.off('click');
      });

      $scope.$on('$routeChangeStart', function () {
        minimize(true);
      });

      $scope.$on('minimized', function () {
        $scope.maximized = false;
      });
    }
  };
}