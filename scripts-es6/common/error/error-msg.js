export default function alertBox ($rootScope, $timeout) {
  'ngInject';

  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'common/error/error.html',
    link: function ($scope, element, attrs) {
      $scope.alerts = $rootScope.alerts;
      $scope.closeAlert = $rootScope.closeAlert;
    }
  }
}

export function errorRunBlock ($rootScope, $timeout) {
  'ngInject';

  let alerts = $rootScope.alerts = [];

  $rootScope.addAlert = (alert, autohideTime = 3000) => {
    alerts.push(alert);
    $timeout(() => {
      _.remove(alerts, (existingAlert) => {
        return _.isEqual(alert, existingAlert);
      });
    }, autohideTime);
  };

  $rootScope.closeAlert = (index) => {
    alerts.splice(index, 1);
  };
}
