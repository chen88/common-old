export function rowNavigation () {
  return {
    restrict: 'A',
    scope: {
      rowIndex: '=',
      onChange: '&',
      max: '<',
      offset: '@',
    },
    link: function ($scope, element, attrs) {
      let doc = $(document);
      let table, tbody, target;
      let offset = parseInt($scope.offset) || 0;
      

      if(attrs.table) {
        let intervalId = setInterval(() => {
          table = attrs.table ? $(attrs.table) : null;
          if(table) {
            tbody = table.children('tbody');
            clearInterval(intervalId);
          }
        }, 500);
      }
      if(attrs.target) {
        let intervalId = setInterval(() => {
          target = attrs.target ? $(attrs.target) : null;
          if(target) {
            clearInterval(intervalId);
          }
        }, 500);
      }

      let onChange = (rowIndex, direction) => {
        if(table) {
          let row = table.find(`tbody tr:eq(${rowIndex + offset})`)[0];
          if(row && !isElementInViewport(row)) {
            row.scrollIntoView(direction === 'down');
          }
        }
        a.$timeout(() => {
          $scope.onChange();
        });
      };
      let keyup = (evt) => {
        if(_.isNil($scope.rowIndex) || !isValidTarget(evt)) {
          return;
        }
        if(evt.keyCode === 38) {
          //up
          let rowIndex = $scope.rowIndex - 1;
          if(rowIndex >= 0) {
            $scope.rowIndex = rowIndex;
            onChange(rowIndex, 'up');
          }
        } else if(evt.keyCode === 40) {
          //down
          let rowIndex = $scope.rowIndex + 1;
          if(rowIndex <= $scope.max) {
            $scope.rowIndex = rowIndex;
            onChange(rowIndex, 'down');
          }
        }
      }
      tkgConst.bindEvent(doc, 'keyup', keyup, $scope);

      function isValidTarget (evt) {
        let isValidTag = /body|html/.test(evt.target.tagName);
        
        if(isValidTag) {
          return true;
        }
        let evtTarget = $(evt.target);
        let tableTarget = evtTarget.closest('table');
        if((target && evtTarget.is(target)) || tableTarget.is(table)) {
          return true;
        }
        return false;
      }
      function isElementInViewport (el) {
        if(!(el instanceof jQuery)) {
          el = $(el);
        }
        let top = el.position().top
        return top >= 0 && top + el.height() < tbody.height();
      }
    }
  };
}
