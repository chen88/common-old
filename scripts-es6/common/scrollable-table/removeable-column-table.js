let body;
let documentEle;
let headerHeight = tkgConst.size.tableHead;
let delay = tkgConst.timeout.scrollableTable;

angular.element(document).ready(() => {
  body = $('body');
  documentEle = $(document);
});

export function remoavableColumn ($compile, $templateCache) {
  return {
    restrict: 'A',
    require: '?tkgScrollableTable',
    link: ($scope, element, attrs, tableCtrl) => {
      if(!tableCtrl) {
        return;
      }

      tableCtrl.removeableColumns = $scope.$eval(attrs.removeableColumn);
      let id = tkgConst.uuid();
      let menuTmp = $templateCache.get('common/scrollable-table/removeable-column-menu.html');
      let bodyClick = () => {
        tableCtrl.removeRemoveableMenu();
        body.off('click', bodyClick);
      };

      tableCtrl.openRemoevableMenu = function (evt, headerCell) {
        $scope.$apply(() => {
          let compiledMenuTmp = $compile(menuTmp)($scope);
          let left = evt.clientX;
          if(innerWidth - left <= 200) {
            left = innerWidth - 200;
          }
          compiledMenuTmp.css({
            left: left + 'px',
            top: headerHeight + 'px'
          });
          tableCtrl.table.append(compiledMenuTmp);
        });
        body.on('click', bodyClick);
      };

      tableCtrl.removeRemoveableMenu = function () {
        $('#context-menu').remove();
      };

      tableCtrl.removeColumn = function () {
        $scope.$emit('removedCol', {
          element: tableCtrl.toBeRemovedColumn,
          index: tableCtrl.toBeRemovedColumn.index(),
          removed: true
        });
        tableCtrl.removeRemoveableMenu();
        a.$timeout(() => {
          tableCtrl.initializeHeaderCells();
          $scope.$emit('manualResized');
        });
      };

      tableCtrl.toggleColumn = function (col) {
        $scope.$emit('toggledCol', {
          column: col
        });
        a.$timeout(() => {
          tableCtrl.initializeHeaderCells();
          $scope.$emit('manualResized');
        });
      };

    }
  };
}

/**
 * table(tkg-scrollable-table removeable-column)
 *   thead
 *     tr
 *       th
 */
export function removableColumnHeader () {
  return {
    restrict: 'E',
    scope: false,
    priority: 0,
    require: '?^tkgScrollableTable',
    link: ($scope, element, attrs, tableCtrl) => {

      setTimeout(() => {
        init();
      }, delay);

      function init () {
        if(!tableCtrl || _.isNil(tableCtrl.tableAttrs.removeableColumn)) {
          return;
        }

        element.on('contextmenu', (e) => {
          e.stopPropagation();
          tableCtrl.removeRemoveableMenu();
          tableCtrl.toBeRemovedColumn = element;
          tableCtrl.openRemoevableMenu(e, element);
          return false;
        });

        $scope.$on('$destroy', () => {
          element.off('contextmenu');
        });
      }

    }
  }
}
