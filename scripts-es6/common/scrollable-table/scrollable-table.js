/**
 * table(scrollable-table parent=".panel" subtract="15")
 */
let tkgConst = window.tkgConst;
let bindEvent = tkgConst.bindEvent;
let delay = tkgConst.timeout.scrollableTable;
let hPadding = tkgConst.size.horizontalCellPadding * 2;
let borderSize = tkgConst.size.cellBorder;
let scrollbarSize = tkgConst.size.defaultScrollbar;
// let scrollbarSize = 2 //tkgConst.size.defaultScrollbar;
let rowHeight = tkgConst.size.tableHead;

class ScrollableTableCtrl {
  constructor () {
    this.table;
    this.tableChildren;
    this.tableHeader;
    this.tableHeaderRow;
    this.tableBody;
    this.headerCells = [];
    this.nonFixedHeaderCells = [];
    this.fixedHeaderCells = [];
    this.headerCellWidths = [];
  }
  initializeTable (table, attrs) {
    this.table = table;
    this.tableAttrs = attrs;
    this.tableChildren = table.children();
    this.tableHeader = this.tableChildren.eq(0); // thead
    this.tableHeaderRow = this.tableHeader.children(); // thead tr
    this.tableBody = this.tableChildren.eq(1); //tbody
    this.bodyReduction = tkgConst.size.panelHeading + tkgConst.size.tableHead + (attrs.subtract || 0);
    this.parent = attrs.parent ? table.parents(attrs.parent) : table.parents('.panel');
    table.addClass('scrollable-table stripe');
    this.initializeHeaderCells();
  }
  tableScroll () {
    this.tableHeaderRow.css({
      left: -1 * this.tableBody.scrollLeft() + 'px'
    });
  }
  initializeCell (cell) {
    let child = cell.children().first();
    if(child.prop('tagName') === 'DIV') {
      return;
    }
    let contents = cell.contents();
    child = $('<div></div>');
    if(!contents.length) {
      cell.append(child);
    } else {
      contents.wrap(child);
    }
  }
  initializeHeaderCells (force) {
    this.headerCells = this.tableHeaderRow.children();
    this.headerCellWidths = [];

    let nonFixedHeaderCells = [];
    let fixedHeaderCells = [];
    let nonFixedCellLength = 0;
    let fixedCellLength = 0;
    let leastMinWidth = 0;

    this.headerCells.each((i, headerCell) => {
      let hCell = $(headerCell);
      let minWidth = headerCell.style.minWidth;
      let maxWidth = headerCell.style.maxWidth || null;
      let isFixed = maxWidth ? true : (typeof(headerCell.getAttribute('fixed')) === 'string' ? true : false);

      if(!hCell.attr('absolute-min-width')) {
        hCell.attr('absolute-min-width', minWidth);
      } else if(force) {
        let absoluteMinWidth = hCell.attr('absolute-min-width');
        minWidth = absoluteMinWidth
      }
      if(!hCell.attr('absolute-max-width')) {
        if(maxWidth && maxWidth === minWidth) {
          maxWidth = parseFloat(maxWidth) + 1 + 'px';
        }
        hCell.attr('absolute-max-width', maxWidth);
      } else if(force) {
        let absoluteMaxWidth = hCell.attr('absolute-max-width');
        maxWidth = parseFloat(maxWidth) > parseFloat(absoluteMaxWidth) ? absoluteMaxWidth : maxWidth;
      }

      this.initializeCell(hCell);
      this.headerCellWidths.push(minWidth);

      minWidth = parseFloat(minWidth);

      hCell.css({
        width: minWidth
      });
      hCell.children().first().css({
        width: minWidth - hPadding,
        minWidth: minWidth - hPadding
      });

      this.headerCells[i].isFixed = isFixed;
      if(isFixed) {
        fixedHeaderCells.push(hCell);
        fixedCellLength++;
        nonFixedHeaderCells.push(null);
      } else {
        nonFixedHeaderCells.push(hCell);
        nonFixedCellLength ++;
        fixedHeaderCells.push(null);
      }

      leastMinWidth += parseFloat(hCell.attr('absolute-min-width'));

    });

    this.nonFixedHeaderCells = nonFixedHeaderCells;
    this.fixedHeaderCells = fixedHeaderCells;
    this.nonFixedCellLength = nonFixedCellLength;
    this.fixedCellLength = fixedCellLength;
    this.leastMinWidth = leastMinWidth;
  }

  resizeTable () {
    clearTimeout(this.tableCounter);
    clearTimeout(this.headerCounter);
    this.tableCounter = setTimeout(() => {
      let tableWidth = this.table.width();
      let tableBodyHeight = this.parent.height() - this.bodyReduction;
      this.tableChildren.width(tableWidth);
      this.tableBody.height(tableBodyHeight);
      this.headerCounter = setTimeout(() => {
        this.resizeHeaderCells();
        this.resizeBodyCells();
      }, delay);
    }, delay);
  }

  resizeHeaderCell (headerCell, width) {
    let content = headerCell.children().first(); // div
    let absoluteMinWidth = parseFloat(headerCell.attr('absolute-min-width'));
    let absoluteMaxWidth = parseFloat(headerCell.attr('absolute-max-width')) || null;

    if(absoluteMaxWidth && width > absoluteMaxWidth) {
      width = absoluteMaxWidth;
      if(absoluteMaxWidth === absoluteMinWidth) {
        absoluteMaxWidth += 1;
      }
    } else if(width < absoluteMinWidth) {
      width = absoluteMinWidth;
    }

    width = parseInt(width);

    headerCell.css({
      width: width,
      minWidth: width,
      maxWidth: absoluteMaxWidth,
    });

    content.css({
      width: width - hPadding,
      minWidth: width - hPadding,
      maxWidth: width - hPadding,
    });

    return width;
  }

  resizeHeaderCells () {
    this.headerCells.children('.col-resize').css('left', 'auto');
    let totalHeaderCellWidth = 0;
    let individualHeaderCellWidth = [];
    let tableWidth = this.table.width();

    this.headerCells.each((i, headerCell) => {
      headerCell = $(headerCell);
      let headerCellWidth = headerCell.outerWidth();
      totalHeaderCellWidth += headerCellWidth;
      individualHeaderCellWidth.push(headerCellWidth);
    });

    this.totalHeaderCellWidth = totalHeaderCellWidth;
    let widthDifference = tableWidth - totalHeaderCellWidth;
    let additionalLength = widthDifference;
    // let additionalLength = widthDifference / this.nonFixedCellLength;

    if(this.hasScrollbar && totalHeaderCellWidth > this.leastMinWidth) {
      additionalLength -= scrollbarSize;
    }

    let splitAdditionalLength = additionalLength / this.nonFixedCellLength;
    let decimal = splitAdditionalLength % 1;
    let skip = Math.ceil(1/decimal);
    if(skip > this.nonFixedCellLength) {
      skip = 0;
    }

    if(Math.abs(additionalLength) < 1) {
      splitAdditionalLength = 0;
      skip = 0;
    }

    let nonFixedCellLength = this.nonFixedCellLength;
    let step = 0;
    _.forEach(this.nonFixedHeaderCells, (headerCell, i) => {
      if(!headerCell) {
        return;
      }
      step ++;
      let currentSplitAdditionalLength = Math.floor(splitAdditionalLength);
      if(skip > 0 && (step / skip) % 1 === 0) {
        currentSplitAdditionalLength = Math.ceil(splitAdditionalLength);
      }
      let isFirstCell = i === 0;
      let newWidth = individualHeaderCellWidth[i] + currentSplitAdditionalLength;
      if(!isFirstCell) {
        newWidth -= borderSize;
      }
      let restrictedWidth = this.resizeHeaderCell(headerCell, newWidth);
      this.headerCellWidths[i] = restrictedWidth;
    });

  }

  resizeBodyCell (bodyCell) {
    let content = bodyCell.children().first(); // div
    let newWidth = parseFloat(this.headerCellWidths[bodyCell.index()]);

    bodyCell.css({
      width: newWidth,
      minWidth: newWidth
    });

    content.css({
      width: newWidth - hPadding,
      minWidth: newWidth - hPadding
    });
  }

  resizeBodyCells () {
    let bodyRows = this.tableBody.children(); // tr
    bodyRows.each((rowI, row) => {
      row = $(row);
      let rowCells = row.children(); // td
      rowCells.each((cellI, bodyCell) => {
        bodyCell = $(bodyCell);
        this.resizeBodyCell(bodyCell);
      });
    });
  }

  resizeNewBodyCells () {
    clearTimeout(this.newBodyCellCounter);
    this.newBodyCellCounter = setTimeout(() => {
      this.hasScrollbar = this.tableBody.children().length * 25 > this.tableBody.height() &&
                          this.tableBody[0].scrollWidth !== this.tableBody.width();
      // if(this.tableBody.children().length * 25 > this.tableBody.height()) {
      //   this.hasScrollbar = true;
      // } else {
      //   this.hasScrollbar = false;
      // }
      this.resizeTable();
    }, delay);
  }

  resizeColumn (index, width, autoResize) {
    let self = this;
    let headerCell = $(this.headerCells[index]);

    headerCell.attr('absolute-min-width', width);
    if(!autoResize) {
      headerCell.attr('absolute-max-width', (parseInt(width) + 1) + 'px');
    }

    let restrictedWidth = this.resizeHeaderCell(headerCell, width);
    this.headerCellWidths[index] = restrictedWidth;

    this.tableBody.children().each(function () {
      let bodyCell = $(this).children().eq(index);
      self.resizeBodyCell(bodyCell);
    });
  }

  // Debug
  reduceColWidth (i) {
    i = i || 0;
    let firstHeaderCell = $(this.headerCells[i]);
    let width = firstHeaderCell.outerWidth();
    let newWidth = width - 1;
    this.headerCellWidths[i] = newWidth;
    this.resizeHeaderCell(firstHeaderCell, newWidth);
    this.resizeBodyCells();
  }

  getCurrentHeaderCellsCalculation () {
    let totalWidth = 0;
    this.headerCells.each((i, headerCell) => {
      headerCell = $(headerCell);
      let headerCellWidth = headerCell.outerWidth();
      totalWidth += headerCellWidth;
    });
    console.log('headerCell Total: ' + totalWidth);
  }
  getWidth () {
    console.log(`table: ${this.table.width()}`)
    console.log(`thead: ${this.tableHeader.width()}`)
    console.log(`tbody: ${this.tableBody.width()}`)
  }
}
/**
 * table(tkg-scrollable-table)
 */
export function ScrollableTable (prepareWindowEvents) {
  return {
    restrict: 'A',
    scope: true,
    controller: ScrollableTableCtrl,
    controllerAs: 'tableCtrl',
    link: function ($scope, element, attrs, tableCtrl) {
      tableCtrl.initializeTable(element, attrs);
      tkgConst.bindEvent(tableCtrl.tableBody, 'scroll', () => {
        tableCtrl.tableScroll();
      }, $scope);

      $scope.$on('manualResized', () => {
        tableCtrl.resizeTable();
      });

      function resize () {
        tableCtrl.resizeTable();
      }

      prepareWindowEvents($scope, resize);

      $scope.isNaN = tkgConst.isNaN;

      if(attrs.watch) {
        $scope.$watch(attrs.watch, (val) => {
          if(val) {
            tableCtrl.resizeTable();
          }
        });
      }
    }
  };
}

/**
 * table(tkg-scrollable-table)
 *   thead
 */
export function ScrollableHeader (prepareWindowEvents) {
  return {
    restrict: 'E',
    scope: false,
    require: '?^tkgScrollableTable',
    link: function ($scope, element, attrs, tableCtrl) {
      if(!tableCtrl || !(tableCtrl instanceof ScrollableTableCtrl)) {
        return;
      }
      let table = element.parent();
      setTimeout(() => {
        tableCtrl.resizeTable();

        // Dynamic Header
      }, delay);

      $scope.$on('fireLastRepeat', (e) => {
        e.stopPropagation();
        setTimeout(() => {
          tableCtrl.initializeHeaderCells();
          tableCtrl.resizeTable();
        }, delay);
      });

      if(attrs.watch) {
        $scope.$watch(attrs.watch, (current, prev) => {
          if(prev) {
            setTimeout(() => {
              $scope.$broadcast('resetStyle');
              tableCtrl.initializeHeaderCells(true);
              tableCtrl.resizeTable();
              $scope.$broadcast('colResizeInit');
            }, delay);
          }
        });
      }
    }
  };
}

/**
 * table(tkg-scrollable-table)
 *   thead
 *     tr
 *       th(watch-style ng-style)
 */
export function WatchStyle (prepareWindowEvents) {
  return {
    restrict: 'A',
    // scope: false,
    // priority: 9999,
    require: '?^tkgScrollableTable',
    link: function ($scope, element, attrs, tableCtrl) {
      if(!tableCtrl || !(tableCtrl instanceof ScrollableTableCtrl)) {
        return;
      }
      let table = element.closest('table');
      let initBodyCell = () => {
        setTimeout(() => {
          $scope.$watch(() => {
            return $scope.$eval(attrs.ngStyle);
          }, resetHeaderCells, true);
        }, delay)
      };

      initBodyCell();

      let resetHeaderCells = (newStyle, prevStyle) => {
        setTimeout(() => {
          tableCtrl.initializeHeaderCells(true);
          tableCtrl.resizeTable();

          if(newStyle && prevStyle && prevStyle.width && newStyle.width && newStyle.width !== prevStyle.width) {
            tableCtrl.resizeColumn(element.index(), newStyle.width, true);
          }
        }, delay);
      };

      if(attrs.ngStyle) {
        $scope.$on('resetStyle', () => {
          let originalStyle = $scope.$eval(attrs.ngStyle);
          element.css(originalStyle);
        });
      }



    }
  };
}

/**
 * table(tkg-scrollable-table)
 *   tbody
 *     tr
 *       td
 */
export function ScrollableBodyCell () {
  return {
    restrict: 'E',
    scope: false,
    require: '?^tkgScrollableTable',
    link: function ($scope, element, attrs, tableCtrl) {
      if(!tableCtrl || !(tableCtrl instanceof ScrollableTableCtrl)) {
        return;
      }
      let table = element.closest('table');
      let initBodyCell = () => {
        setTimeout(() => {
          tableCtrl.initializeCell(element);
          tableCtrl.resizeNewBodyCells();
        }, delay)
      };

      initBodyCell();

    }
  };
}

export * from './removeable-column-table';
export * from './resizable-column-table';
export * from './swappable-column';
