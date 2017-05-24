/**
 * Use with ui-sortable to sort the list without dragging
 * ul.sortable-list(ui-stortable="config" tkg-sort ng-model="sortList")
 *   li
 *     span.curved-arrow-up(tkg-sort-up, ng-hide="$first")
 *      i.fa.fa-refresh
 *     span.curved-arrow-down(tkg-sort-down, ng-hide="$last")
 *      i.fa.fa-refresh
 */
export function TkgSort () {
  return {
    resttrict: 'A',
    // controller: TkgSortCtrl,
    // controllerAs: 'tkgSortCtrl',
    require: '?ngModel',
    link: function ($scope, element, attrs, ngModel) {
    }
  };
}

export function TkgSortUp () {
  return {
    resttrict: 'A',
    require: '^^ngModel',
    link: function ($scope, element, attrs, ngModel) {
      let sortUp = () => {
        let index = $scope.$index;
        if(index === 0) {
          return;
        }
        let value = _.pullAt(ngModel.$modelValue, index);
        ngModel.$modelValue.splice(--index, 0, value[0]);
      }

      tkgConst.bindEvent(element, 'click', sortUp, $scope);
    }
  }
}

export function TkgSortDown () {
  return {
    resttrict: 'A',
    require: '^^ngModel',
    link: function ($scope, element, attrs, ngModel) {
      let sortDown = () => {
        let index = $scope.$index;
        if(index >= ngModel.$modelValue.length) {
          return;
        }
        let value = _.pullAt(ngModel.$modelValue, index);
        ngModel.$modelValue.splice(++index, 0, value[0]);
      }

      tkgConst.bindEvent(element, 'click', sortDown, $scope);

    }
  }
}
