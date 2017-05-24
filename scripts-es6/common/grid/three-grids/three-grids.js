export function tkgThreeGrids (tkgConfig) {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/three-grids/three-grids.html',
    scope: false,
    link: function ($scope, element, attrs) {
      $scope.gridTemplate = tkgConfig.getThreeGrids();
    }
  };  
}