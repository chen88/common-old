export function tkgHeader (loginService) {
  return {
    restrict: 'E',
    templateUrl: 'common/directives/header/header.html',
    transclude: true,
    link: function ($scope, element, attrs) {
      if(attrs.auth !== 'false') {
        if(!loginService.validateLogin()) {
          loginService.redirectToLogin();
          return;
        }

        $scope.header = $scope.header || {};

        $scope.header.logout = function () {
          loginService.logout();
        };


        loginService.getUserInfo().then(function (user) {
          $scope.header.user = user
        });

      }

      setTimeout(function () {
        $('#tkg-header').height(tkgConst.size.header);
        $('#tkg-banner h1').css({lineHeight: (tkgConst.size.header - tkgConst.size.padding) + 'px'});
      }, 50);
    }
  };
}

export function tkgHeaderUser ($location, $routeParams, loginService) {
  return {
    restrict: 'A',
    scope: true,
    link: function ($scope, element) {
      $scope.user = {};
      loginService.getUserInfo().then(function (user) {
        $scope.user = user;
      });

      $scope.logout = function () {
        loginService.logout();
      };

      $scope.changePw = function () {
        $location.path('/password');
      };

      $scope.getUserName = function () {
        var emulate = sessionStorage.getItem('emulate');
        var emulateUser = emulate ? '(as ' + emulate + ')' : '';
        if($scope.user.realName || $scope.user.firstName || $scope.user.lastName) {
          return $scope.user.realName || $scope.user.firstName + ' ' + $scope.user.lastName + emulateUser;
        }
        return $scope.user.userName + emulateUser;
      };

      $scope.originalApp = $routeParams.app;

      $scope.routeBackToOriginalApp = function () {
        if($routeParams.from) {
          window.location.assign($routeParams.from);
        }
      };
    }
  };
}