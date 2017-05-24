export function resizeBar ($rootScope, $interpolate) {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'common/grid/resize-bar.html',
    priority: 0,
    link: ($scope, element, attrs) => {
      var resizingWidth = tkgConst.size.primaryBorder;
      var idleWidth = tkgConst.size.resizerWidth;

      var prevElementAttr = attrs.prevElement ? $interpolate(attrs.prevElement)($scope) : undefined
      var nextElementAttr = attrs.nextElement ? $interpolate(attrs.nextElement)($scope) : undefined;
      var prevElement = prevElementAttr ? $(prevElementAttr) : element.prev();
      var nextElement = nextElementAttr ? $(nextElementAttr) : element.next();

      var adjustCurrentElement = attrs.adjustCurrent === 'true';
      var currentElementAttr = attrs.currentElement ? $interpolate(attrs.currentElement)($scope) : undefined;
      var currentElement = currentElementAttr ? $(currentElementAttr) : null;
      var bar = element.children();
      var barPosition = $scope.position = attrs.position;
      var offset = tkgConst.size.primaryBorder/2;

      /** Initialize position **/
      function setPosition () {
        window.setTimeout(function () {
          if( barPosition === 'vertical' ) {
            bar.css({
              left: prevElement.width() - offset
            });
          } else {
            bar.css({
              top: prevElement.height() + offset
            });
          }
        }, tkgConst.timeout.setResizeBar);
      }
      setPosition();

      /** Initialize mousemovement **/
      var body = $('body')
        , initialPosition
        , finalPosition
        , minimumSize = tkgConst.size.minimumGridSize - offset
        , nextElementWidth
        , nextElementHeight
        , currentElementWidth
        , tempCurrentElementWidth
        , moved = false
        , lastPosition
        , mousedown
        , mousemove
        , mouseup
        , moveBar
        , adjustContents
        , adjustCurrentElementContent
        ;

      function initializeMousedown () {
        moved = true;
        bar.addClass('moving');
        body.addClass('resizing');
        body.on('mousemove', mousemove);
        body.on('mouseup', mouseup);
      }

      function initializeMouseup () {
        moved = false;
        lastPosition = undefined;
        bar.removeClass('moving');
        body.removeClass('resizing');
        body.off('mousemove', mousemove);
        body.off('mouseup', mouseup);

        if(adjustCurrentElement) {
          bar.css({
            left: 0
          });
        }
      }

      /** vertical resizer bar events **/
      if(barPosition === 'vertical') {
        mousedown = function (evt) {
          /** ignore middle and right buttons click **/
          if( evt.which === 2 || evt.which === 3 ) {
            return;
          }
          initialPosition = bar.position().left;
          nextElementWidth = nextElement.width();
          if(adjustCurrentElement) {
            currentElementWidth = currentElement.width();
            tempCurrentElementWidth = currentElementWidth;
          }
          bar.css({
            width: resizingWidth
          });
          initializeMousedown();
        };
        mousemove = function (evt) {
          if( !lastPosition ) {
            lastPosition = evt.clientX;
            return;
          }
          moveBar(evt);
          lastPosition = evt.clientX;
          // tkgConst.preventSelection(evt);
        };
        moveBar = function (evt) {
          var distance = evt.clientX - lastPosition;
          var currentPosition = bar.position().left;
          var newPosition = currentPosition + distance;
          // Adjust one grid only
          if( adjustCurrentElement ) {
            tempCurrentElementWidth = tempCurrentElementWidth + distance
            if(tempCurrentElementWidth >= minimumSize || distance > 0) {
              bar.css({left: newPosition});
            } else {
              tempCurrentElementWidth = minimumSize;
            }
          } else {
            //Adjust multiple grid
            if( newPosition >= minimumSize
                && newPosition - initialPosition <= nextElementWidth - minimumSize
                && nextElementWidth >= minimumSize ) {
              bar.css({left: newPosition});
            }
          }
        };
        mouseup = function (evt) {
          finalPosition = bar.position().left;
          adjustContents();
          bar.css({
            width: idleWidth
          });
          initializeMouseup();
        };
        /** left and right elements must be grid contents **/
        adjustCurrentElementContent = function (totalDistance) {
          var originalWidth = currentElement.width();
          currentElement.css({
            width: originalWidth + totalDistance
          });
          $rootScope.$broadcast('manualResized');
        }

        adjustContents = function () {
          var totalDistance = finalPosition - initialPosition
            , prevEleWidth = prevElement.width()
            , nextEleWidth = nextElement.width()
            ;
          //Adjust one grid only
          if(adjustCurrentElement) {
            return adjustCurrentElementContent(totalDistance);
          }

          //Adjust multiple grid
          try {
            prevElement.scope().resetGridSize(prevEleWidth + totalDistance, totalDistance);
            $rootScope.$broadcast('manualResized');
          } catch (e) {
            console.error(e);
          }
        };
      }
      /** horizontal resizer bar events **/
      else {
        mousedown = function (evt) {
          /** ignore middle and right buttons click **/
          if( evt.which === 2 || evt.which === 3 ) {
            return;
          }
          initialPosition = bar.position().top;
          nextElementHeight = nextElement.height();
          bar.css({
            height: resizingWidth
          });
          initializeMousedown();
        };
        mousemove = function (evt) {
          if( !lastPosition ) {
            lastPosition = evt.clientY;
            return;
          }
          moveBar(evt);
          lastPosition = evt.clientY;
          tkgConst.preventSelection(evt);
        };
        moveBar = function (evt) {
          var distance = evt.clientY - lastPosition;
          var currentPosition = bar.position().top;
          var newPosition = currentPosition + distance;
          if( newPosition >= minimumSize
              && newPosition - initialPosition <= nextElementHeight - minimumSize
              && nextElementHeight >= minimumSize ) {
            bar.css({top: newPosition});
          }
        };
        mouseup = function (evt) {
          finalPosition = bar.position().top;
          adjustContents();
          bar.css({
            height: idleWidth
          });
          initializeMouseup();
        };
        adjustContents = function () {
          var totalDistance = finalPosition - initialPosition
            , prevEleHeight = prevElement.height()
            , nextEleHeight = nextElement.height()
            ;
          try {
            prevElement.scope().resetGridSize(prevEleHeight + totalDistance);
            $rootScope.$broadcast('manualResized');
          } catch (e) {
            console.error(e);
          }
        };
      }

      element.on('mousedown', mousedown);

      $scope.$on('panelMinimized', setPosition);

      $scope.$on('$destroy', function () {
        element.off('mousedown');
        body.off('mousemove mouseup');
      });
    }
  };
}