/**
 * table(
 *  scrollable-table-s 
 *  head-data="headData"
 *  body-data="bodyData"
 *  parent=".panel" 
 *  subtract="15")
 */
let tkgConst = window.tkgConst;
let bindEvent = tkgConst.bindEvent;
let delay = tkgConst.timeout.scrollableTable;
let hPadding = tkgConst.size.horizontalCellPadding * 2;
let borderSize = tkgConst.size.cellBorder;
let scrollbarSize = tkgConst.size.defaultScrollbar;
let thWidth = tkgConst.size.thWidth;
let _prepareWindowEvents;
let numberOfRows = tkgConst.numberOfRows;
let _$compile;

class ScrollableTabelCtrl {
  constructor () {
    this.table;
    this.tableChildren;
    this.headData;
    this.tableHeaderRow;
    this.tableBody;
    this.bodyData = [];
    this.tableBodyRows = [];
    this.headerCells = [];
    this.nonFixedHeaderCells = [];
    this.fixedHeaderCells = [];
    this.headerCellWidths = [];
  }
  initializeTable ($scope, table, attrs) {
    this.$scope = $scope;
    this.table = table;
    this.tableAttrs = attrs;
    this.bodyReduction = tkgConst.size.panelHeading + tkgConst.size.tableHead + (attrs.subtract || 0);
    this.parent = attrs.parent ? table.parents(attrs.parent) : table.parents('.panel');
    this.numberOfRows = attrs.numberOfRows || numberOfRows;
    table.addClass('scrollable-table stripe');
    let headData = $scope.$eval(attrs.headData);
    this.initHead(headData);
    this.initBody();
  }
  /**
   * 
   * @param {Object} headData 
   *  @property {string} name 
   *  @property {*} value
   *  @property {Object} style
   */
  initHead (headData) {
    this.tableHeaderRow = $('<tr></tr>');
    let tableHeader = $('<thead></thead>');
    tableHeader.append(this.tableHeaderRow);
    this.table.append(tableHeader);
    this.initializeHeaderCells(headData);
  }
  getCellContentWidth (h) {
    let style = h.style || {};
    if(!style.width) {
      style.width = thWidth;
      style.minWidth = thWidth;
      h.style = style;
    }
    let cellContentWidth = parseInt(style.width) - hPadding;
    return cellContentWidth;
  }
  initializeHeaderCells (headData) {
    this.headData = headData;
    let tableHeaderRow = this.tableHeaderRow;
    _.forEach(headData, (h) => {
      // headerCell content
      let cellContentWidth = this.getCellContentWidth(h);
      let cellContent = $('<div></div>');
      cellContent.css({
        width: cellContentWidth,
        minWidth: cellContentWidth
      });
      cellContent.append(h.name);
      cellContent = _$compile(cellContent)(this.$scope);

      // headerCell
      let headerCell = $('<th></th>');
      headerCell.css(h.style);
      headerCell.append(cellContent);
      tableHeaderRow.append(headerCell);
    });
  }
  changeHead (headData) {
    let currentHeadLength = this.headData.length;
    let newHeadLength = headData.length;
    let difference = currentHeadLength - newHeadLength;
    console.log(difference);
    if(currentHeadLength > newHeadLength) {
      let headerCells = this.tableHeaderRow.find(`td:gt(${currentHeadLength})`);
      // let headerCellContent = headerCells.find('*');
      let bodyCells = this.table.find(`tr td:gt(${currentHeadLength})`);
      // let bodyCellContents = bodyCells.find('*');
      // headerCellContent.off();
      headerCells
        // .off()
        .remove();
      // bodyCellContents.off();
      bodyCells
        // .off()
        .remove();
    } else if(currentHeadLength < newHeadLength) {
      difference = Math.abs(difference);
      for(let i = 0; i < difference; i++) {
        this.insertColumn();
      }
    }
    this.headData = headData;
    let headerCells = this.tableHeaderRow.children();
    let bodyRows = this.tableBody.children();

    _.forEach(headData, (h, i) => {
      // set header
      let cellContentWidth = this.getCellContentWidth(h);
      let style = h.style;
      let headerCell = headerCells.eq(i);
      let headerCellContent = headerCell.children().first();
      headerCellContent
        .css({
          width: cellContentWidth,
          minWidth: cellContentWidth
        })
        .empty()
        .append(h.name)
      headerCell
        .removeAttr('style')
        .css(style);
      _$compile(headerCellContent)(this.$scope);

      // set body
      _.forEach(bodyRows, (row, j) => {
        let bodyCell = $(row).children().eq(i);
        let bodyCellContent = bodyCell.children().first();
        bodyCellContent
          .css({
            width: cellContentWidth,
            minWidth: cellContentWidth
          });
      });
    });  
  }
  initBody () {
    let tableBody = this.tableBody = $('<tbody></tbody>');
    this.table.append(tableBody);
    let tableRow;
    for(let i = 0; i < this.numberOfRows; i++) {
      tableRow = $('<tr></tr>');
      _.forEach(this.headData, (h) => {
        let style = h.style;
        let width = parseInt(style.width);
        let cellContentWidth = width - hPadding;
        let cellContent = $('<div></div>');
        cellContent.css({
          width: cellContentWidth,
          minWidth: cellContentWidth
        });
        let bodyCell = $('<td></td');
        bodyCell.append(cellContent);
        // bodyCell.css({
        //   width: width,
        //   minWidth: width
        // });
        tableRow.append(bodyCell);
      });
      tableBody.append(tableRow);      
    }
  }
  insertColumn () {
    this.tableHeaderRow.append($('<th><div></div></th>'));
    this.tableBody.children().each(function () {
      $(this).append('<td><div></div></td>');
    })
  }

  setBodyCells (bodyData) {
    let tableBody = this.tableBody;
    if(this.bodyData.length > bodyData.length) {
      tableBody.chilren().slice(bodyData.length, this.bodyData.length).addClass('hide');
    } else if (this.bodyData.length > bodyData.length) {

    }
    this.bodyData = bodyData;
  }
  clearHeaderRow () {
    this.tableHeaderRow.empty();
  }
  tableScroll () {
    this.tableHeaderRow.css({
      left: -1 * this.tableBody.scrollLeft() + 'px'
    });
  }
}

export function ScrollableTableS (prepareWindowEvents, $compile) {
  _$compile = $compile
  _prepareWindowEvents = prepareWindowEvents;
  return {
    restrict: 'A',
    scope: true,
    controller: ScrollableTabelCtrl,
    controllerAs: 'tableCtrl',
    link: ($scope, element, attrs, tableCtrl) => {
      tableCtrl.initializeTable($scope, element, attrs);

      $scope.$watch(attrs.headData, (headData, prev) => {
        if(prev) {
          tableCtrl.changeHead(headData);
          // tableCtrl.clearHeaderRow();
          // tableCtrl.initializeHeaderCells(headData);
        }
      });
      $scope.$watch(attrs.bodyData, (bodyData) => {
        if(bodyData) {
          table.setBodyCells(bodyData);
        }
      });
    }
  }
}