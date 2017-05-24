export function tkgTemplateUrl ($compile, $http, $parse, $templateCache) {
  return {
    restrict: 'A',
    scope: false,
    priority: 1,
    link: function ($scope, element, attrs) {
      var templateUrl = attrs.tkgTemplateUrl;
      if(!templateUrl) {
        return;
      }

      function appendTemplate (template) {
        var compiledTemplate = $compile(template)($scope);
        element.append(compiledTemplate);

        if(attrs.onComplete) {
          $scope.$eval(attrs.onComplete);
        }
      }

      function compileTemplate (url) {
        var cachedTemplate = $templateCache.get(url);
        if(cachedTemplate) {
          appendTemplate(cachedTemplate);
        } else {
          $http({
            method: 'GET',
            url: url
          }).then((res) => {
            appendTemplate(res.data);
          });
        }

      }

      if(/.html$/.test(templateUrl)) {
        compileTemplate(templateUrl);
      } else {
        var watcher = $scope.$watch(function () {
          return $parse(templateUrl)($scope);
        }, function (url) {
          if(url) {
            compileTemplate(url);
            //unbind watcher function
            watcher();
          }
        });
      }
    }
  };
}