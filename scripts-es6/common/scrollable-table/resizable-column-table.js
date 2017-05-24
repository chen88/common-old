let dragging = false;
let body;
let documentEle;
let delay = tkgConst.timeout.scrollableTable;
let _minWidth = tkgConst.size.minCellWidth;
let borderSize = tkgConst.size.cellBorder;
let hPadding = tkgConst.size.horizontalCellPadding * 2;
let isNotLeftClick = tkgConst.isNotLeftClick;
let resizer = $('<div id="col-resizer"></div>');
let resizerWidth = tkgConst.size.resizerWidth;
let tableHeadHeight = tkgConst.size.tableHead;

angular.element(document).ready(() => {
  body = $('body');
  body.append(resizer);
  documentEle = $(document);
});

/**
 * table(tkg-scrollable-table)
 *   thead(resizeable-column)
 */
export function resizableColumn ($compile) {
  return {
    restrict: 'A',
    scope: false,
    priority: 2,
    require: '?^tkgScrollableTable',
    link: ($scope, element, attrs, tableCtrl) => {
      let headerResizer = '<div class="col-resizer"></div>';

      let init = () => {
        setTimeout(() => {
          let headerCells = element.find('th');
          headerCells.each(function (index) {
            let headerCell = $(this);
            if(headerCell.children('.col-resizer').length > 0) {
              return;
            }
            headerCell.append($compile(headerResizer)($scope));
          });
        }, delay);
      };

      init();

      $scope.$on('fireLastRepeat', () => {
        init();
      });

      $scope.$on('colResizeInit', () => {
        init();
      })
    }
  };
}

export function colResizer () {
  return {
    restrict: 'C',
    scope: false,
    priority: 0,
    require: '?^^tkgScrollableTable',
    link: ($scope, element, attrs, tableCtrl) => {
      let headerCell;
      let headerCellIndex;
      let headerCellContent;
      let tableBody;
      let prevX;
      tableCtrl = tableCtrl || $scope.tableCtrl;

      if(!tableCtrl) {
        return;
      }

      let init = () => {
        window.setTimeout(setVar, delay);
      };

      let setVar = () => {
        headerCell = element.parent();
        if(headerCellIndex === headerCell.index()) {
          return;
        }
        headerCellIndex = headerCell.index();
        headerCellContent = headerCell.children().first();
        tableBody = tableCtrl.tableBody;
      };

      init();

      let locateResizer = (evt) => {
        resizer.addClass('on').css({
          top: element.offset().top,
          height: tableBody.height(),
          left: evt.clientX
        });
        body.addClass('resizing ew').on('mousemove', mousemove);
        documentEle.on('mouseup', mouseup);
      };
      let moveResizer = (evt) => {
        resizer.css({
          left: evt.clientX
        });
      };
      let turnOffResizer = (evt) => {
        resizer.removeClass('on');
        body.removeClass('resizing ew').off('mousemove', mousemove);
        documentEle.off('mouseup', mouseup);
      };
      let mousedown = (evt) => {
        if(isNotLeftClick(evt)) {
          return;
        }
        setVar();
        evt.stopPropagation();
        prevX = evt.pageX;
        element.css({
          left: element.position().left + 'px'
        });
        locateResizer(evt);
      };
      let mouseup = (evt) => {
        evt.stopPropagation();
        let width = adjustWidth();
        element.css({
          left: 'auto'
        });
        turnOffResizer(evt);

        $scope.$emit('resizedCol', {
          element: headerCell,
          width: width + 'px',
          index: headerCellIndex
        });
      };
      let mousemove = (evt) => {
        evt.stopPropagation();
        if(calculateCellWidth() < _minWidth && evt.pageX < prevX) {
          return;
        }
        element.css({
          left: (parseInt(element.css('left')) || 0) + evt.pageX - prevX + 'px'
        });
        moveResizer(evt);
        prevX = evt.pageX;
      };
      let calculateCellWidth = () => {
        try {
          return element.offset().left - headerCell.offset().left - resizerWidth/2;
        } catch (e) {
          console.log(e);
          return _minWidth;
        }
      };
      let adjustWidth = () => {
        let width = calculateCellWidth();
        width = width < _minWidth ? _minWidth : width;
        let minWidth = width + hPadding;
        tableCtrl.resizeColumn(headerCellIndex, minWidth);
        return minWidth;
      };

      element.on('mousedown', mousedown);
      $scope.$on('$destroy', () => {
        element.off('mousedown', mousedown);
        body.off('mousemove', mousemove);
        documentEle.off('mouseup', mouseup);
      });

      $scope.$on('colResizeInit', () => {
        setTimeout(() => {
          init();
        });
      })
    }
  };
}
