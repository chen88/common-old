/**
 * A side grid that display info and additional single scrollable grid, that loads templates from $rootScope.gridTemplate
 */

export function tkgOneGrid (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/one-grid/one-grid.html',
    link: function ($scope, element, attrs) {
      $scope.gridTemplate = tkgConfig.getOneGrid();
    }
  };
}
