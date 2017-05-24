let panelHeaderHeight = tkgConst.size.panelHeading;
let panelBorder = tkgConst.size.panelBorder * 1;
let primaryBorder = tkgConst.size.primaryBorder;
let loaderFadeTime = tkgConst.timeout.loaderFadeTime;

export function ajaxLoader ($parse, prepareWindowEvents) {
  return {
    restrict: 'AE',
    scope: false,
    templateUrl: 'common/directives/ajax/ajax-loader.html',
    link: function ($scope, element, attrs) {
      let parent = attrs.parent ? element.parents(attrs.parent) : element.parents('.panel');
      let loaderBg = element.children();
      let loader = element.children().children();
      let top = attrs.top ? attrs.top + 'px' : undefined;
      let bottomOffset = attrs.bottomOffset || 0;
      let leftOffset = attrs.leftOffset || 0;
      let heightReduction = attrs.heightReduction || 0;
      let widthReduction = attrs.widthReduction || 0;
      let fade = !!attrs.fade;

      $scope.noSpinner = attrs.noSpinner === 'true';
      function getMaximizedSize () {
        loaderBg.css({
          height: parent.height() - panelHeaderHeight,
          width: parent.width(),
          bottom: primaryBorder + panelBorder + 'px',
          left: primaryBorder + panelBorder + 'px',
          top: top
        });
      }

      function getRegularSize () {
        loaderBg.css({
          height: parent.height() - panelHeaderHeight - panelBorder - heightReduction,
          width: parent.width() - panelBorder - widthReduction,
          bottom: bottomOffset + 'px',
          left: leftOffset + 'px',
          top: top
        });
      }

      function show (fade) {
        if($scope.isFromMaximized) {
          getMaximizedSize();
        } else {
          getRegularSize();
        }
        if(!fade) {
          loaderBg.show();
        } else {
          loaderBg.fadeIn('slow');
        }
      }

      function hide () {
        setTimeout(function () {
          if(!fade) {
            loaderBg.hide();
          } else {
            loaderBg.fadeIn('slow');
          }
        }, loaderFadeTime);
      }

      function blink () {
        show(fade);
        hide();
      }

      $scope.$watch(attrs.watch, function (val, prev) {
        if(prev === undefined) return;
        if(val) {
          show(fade);
        } else {
          hide();
        }
      });

      if(attrs.blinkGroup) {
        $scope.$watchGroup($parse(attrs.blinkGroup)($scope), function (val, prev) {
          blink();
        }, true);
      }

      $scope.$watch(attrs.blink, function (val, prev) {
        if(val && !angular.equals(val, prev)) {
          blink();
        }
      });

      function adjustSize () {
        window.setTimeout(function () {
          if($scope.isFromMaximized) {
            getMaximizedSize();
          } else {
            getRegularSize();
          }
        }, loaderFadeTime);
      }

      $scope.$on('manualResized', adjustSize);
      prepareWindowEvents($scope, adjustSize);
    }
  }
}