export function ngRepeat () {
  return {
    restrict: 'A',
    priority: 999,
    link: function ($scope, element, attrs) {
      if(!attrs.fireLastRepeat) {
        return;
      }
      if($scope.$last) {
        $scope.$emit('fireLastRepeat');
      }
    }
  };
}