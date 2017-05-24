let dragging = false;
let body;
let documentEle;
let delay = tkgConst.timeout.scrollableTable;
let borderSize = tkgConst.size.cellBorder;
let clonedHeaderContent = null;
let currentHoverEle = null;
let prevX;
let swapper = $('<div id="col-swapper"></div>');
let swapperWidth = tkgConst.size.resizerWidth;

angular.element(document).ready(() => {
  body = $('body');
  body.append(swapper);
  documentEle = $(document);
});

let swappingFunc = ($scope, element, attrs, tableCtrl) => {
  let table, tableBody, headerCells, swapOff;
  let headerCellOffsets = [];

  setTimeout(() => {
    if(!tableCtrl || _.isNil(tableCtrl.table.attr('swappable-column'))) {
      return;
    }
    init();
  }, delay);

  let init = () => {
    swapOff = tableCtrl.tableAttrs.swapOff === 'true';
    table = tableCtrl.table;
    tableBody = tableCtrl.tableBody;
    tkgConst.bindEvent(element, 'mousedown', mousedown, $scope);
    $scope.$on('$destroy', () => {
      body
        .off('mouseup', mouseup)
        .off('mousemove', mousemove);
    });
  };

  let createShadowClone = () => {
    removeShadowClone();
    let content = element.children().first();
    clonedHeaderContent = content.clone()
                          .addClass('dragging-element')
                          .css({
                            left: content.offset().left + 'px',
                            top: content.offset().top - documentEle.scrollTop() + content.height() + borderSize + 'px'
                          });
    body.append(clonedHeaderContent);
  };

  let moveShadowClone = (evt) => {
    var currentX = evt.pageX;
    clonedHeaderContent.css({left: clonedHeaderContent.offset().left + currentX - prevX});
    prevX = currentX;
  }

  let removeShadowClone = () => {
    if(!clonedHeaderContent) {
      return;
    }
    clonedHeaderContent.remove();
    clonedHeaderContent = null;
  };

  let locateSwapper = (evt) => {
    swapper.addClass('on').css({
      top: element.offset().top,
      height: tableBody.height(),
      left: element.offset().left - swapperWidth/2
    });
  };

  let getStoppedCellIndex = (evt) => {
    let currentX = evt.clientX;
    let cellIndex = _.findIndex(headerCellOffsets, (offset) => {
      return offset > currentX;
    });
    cellIndex = cellIndex === 0 ? 0 : cellIndex - 1;
    return cellIndex;
  };

  let moveSwapper = (evt) => {
    let stoppedIndex = getStoppedCellIndex(evt);
    // stoppedIndex = stoppedIndex === 0 ? 0 : stoppedIndex - 1;
    swapper.css({
      left: headerCellOffsets[stoppedIndex] - swapperWidth/2
    });
  };

  let swapColumn = (evt) => {
    swapper.removeClass('on');
    let toIndex = getStoppedCellIndex(evt);
    let currentIndex = element.index();
    if(toIndex === currentIndex) {
      return;
    }
    let fromHeaderElement = tableCtrl.tableHeaderRow.find(`th:eq(${currentIndex})`);
    let toHeaderElement = tableCtrl.tableHeaderRow.find(`th:eq(${toIndex})`);
    $scope.$emit('swappedCol', {
      fromElement: fromHeaderElement,
      toElement: toHeaderElement,
      fromIndex: currentIndex,
      toIndex: toIndex
    });

    if(swapOff) {
      tableCtrl.initializeHeaderCells();
      return;
    }

    fromHeaderElement.detach().insertBefore(toHeaderElement);


    let fromElement;
    let toElement;
    tableCtrl.tableBody.children().each((i, tr) => {
      tr = $(tr);
      fromElement = tr.find(`td:eq(${currentIndex})`);
      toElement = tr.find(`td:eq(${toIndex})`);
      fromElement.detach().insertBefore(toElement);
    });
    tableCtrl.initializeHeaderCells();
  };

  let mousedown = (evt) => {
    if( evt.which === 2 || evt.which === 3 ) {
      return;
    }
    prevX = evt.pageX;
    headerCells = tableCtrl.headerCells;
    headerCells.each((i, headerCell) => {
      headerCellOffsets[i] = headerCell.getBoundingClientRect().left;
    });
    createShadowClone();
    locateSwapper(evt);

    body
      .addClass('dragging')
      .off('mouseup', mouseup)
      .on('mouseup', mouseup)
      .off('mousemove', mousemove)
      .on('mousemove', mousemove);
  };

  let mousemove = (evt) => {
    moveShadowClone(evt);
    moveSwapper(evt);
  };

  let mouseup = (evt) => {
    body
      .removeClass('dragging')
      .off('mouseup', mouseup)
      .off('mousemove', mousemove);
    removeShadowClone();
    swapColumn(evt);
  };
}

/**
 * table(tkg-scrollable-table swappable-column swap-off="true/false")
 *   thead
 *     tr
 *       th
 */
export function swappableColumnHeader () {
  return {
    restrict: 'E',
    scope: false,
    priority: 1,
    require: '?^tkgScrollableTable',
    link: swappingFunc
  };
}
