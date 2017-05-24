export function displayPrice () {
  return {
    require: 'ngModel',
    link: function ($scope, element, attrs, ngModel) {
      var displaySymbol = attrs.showPercent;

      function toView (value) {
        if( value && value.indexOf('$') === -1) {
          var originalValue = value;
          value = '$' + value;
          ngModel.$setViewValue(value);
          ngModel.$render();
          return originalValue;
        }
        return value.replace(/[$,]/g, '');
      }

      function toModel (value) {
        if( value && typeof(value) === 'string' && value.indexOf('$') === -1 ) {
          var originalValue = value;
          value = '$' + value;
        }
        return value;
      }

      ngModel.$formatters.push(toModel);
      ngModel.$parsers.push(toView);
    }
  };
}