export function uppercase () {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var capitalize = function(inputValue) {
        if (!inputValue) {
          return;
        }
        var capitalized = inputValue.toUpperCase();
        if (capitalized !== inputValue) {
          modelCtrl.$setViewValue(capitalized);
          modelCtrl.$render();
        }
        return capitalized;
      };
      modelCtrl.$parsers.push(capitalize);
      capitalize(scope[attrs.ngModel]);  // capitalize initial value
    }
  };
}