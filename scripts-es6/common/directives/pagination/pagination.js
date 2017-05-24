// tkg-pagination(
//   current-page="#{paging}.currentPage"
//   total-item="#{paging}.totalResult"
//   items-per-page="#{paging}.maxResult"
//   on-change="#{vm}.fetchRecord()"
//   name="orders")
export function tkgPagination ($timeout) {
  return {
    restrict: 'E',
    templateUrl: 'common/directives/pagination/pagination.html',
    transclude: true,
    scope: {
      currentPage: '=',
      totalItem: '=',
      itemsPerPage: '=',
      onChange: '&',
      name: '@',
      hideCount: '@'
    },
    link: function ($scope, element, attrs) {
      $scope.currentPage = $scope.currentPage || 1;
      $scope.itemsPerPage = $scope.itemsPerPage || 50;
      $scope.onChange = $scope.onChange || _.noop;
      $scope.totalPages = 1;
      $scope.name = $scope.name || 'items';
      $scope.hideCount = $scope.hideCount === 'true' ? true : false;
      $scope.withPageNav = typeof(attrs.withPageNav) === 'string' && attrs.withPageNav !== 'false';
      $scope.track = {
        page: $scope.currentPage
      };

      function navBack (allTheWay) {
        if($scope.currentPage > 1) {
          if(allTheWay) {
            $scope.currentPage = 1;
          } else {
            $scope.currentPage --;
          }
        }
      }

      function navForward (allTheWay) {
        if($scope.currentPage < $scope.totalPages) {
          if(allTheWay) {
            $scope.currentPage = $scope.totalPages;
          } else {
            $scope.currentPage ++;
          }
        }
      }

      $scope.nav = function (action) {
        var currentPage = $scope.currentPage;
        switch (action) {
          case 'backward':
            navBack();
            break;
          case 'forward':
            navForward();
            break;
          case 'fast backward':
            navBack(true);
            break;
          case 'fast forward':
            navForward(true);
            break;
        }
        if(currentPage === $scope.currentPage) {
          return;
        }
        $timeout(function () {
          $scope.onChange();
        });
      };

      $scope.toPage = function () {
        var page = $scope.track.page;
        if(page > $scope.totalPages || page < 1 || page === $scope.currentPage) {
          $scope.track.page = $scope.currentPage;
          return;
        }
        $scope.currentPage = page;
        $timeout(function () {
          $scope.onChange();
        });
      };

      $scope.$watch('currentPage', function (page) {
        $scope.track.page = page;
      });

      $scope.$watch('totalItem', function (totalItem) {
        if(totalItem) {
          $scope.totalPages = Math.ceil(totalItem/$scope.itemsPerPage);
        } else {
          $scope.totalPages = 1;
        }
      });
    }
  };
}

export function filterPagination () {
  return function (list, currentPage, itemsPerPage, func) {
    if(!list || !list.length) { return null; }

    var from = (currentPage - 1) * itemsPerPage;
    var to = from + itemsPerPage;
    var items = list.slice(from, to);
    func = func || _.noop;
    func(items);
    return items;
  };
}