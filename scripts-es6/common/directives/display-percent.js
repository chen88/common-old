export function displayPercent () {
  return {
    require: 'ngModel',
    link: function ($scope, element, attrs, ngModel) {
      var displaySymbol = attrs.showPercent;
      var noConversion = attrs.noConversion;
      var conversion = noConversion ? 1 : 100;

      var toView;
      if(displaySymbol) {
        toView = function (value) {
          if( value && !_.isNaN(value) ) {
            return value * conversion +  '%';
          }
          return value;
        }
      } else {
        toView = function (value) {
          if( value && !_.isNaN(value) ) {
            return value * conversion;
          }
          return value;
        }
      }

      function toModel (value) {
        if( value ) {
          value = parseFloat(value) / conversion
        }
        return value;
      }

      ngModel.$formatters.push(toView);
      ngModel.$parsers.push(toModel);
    }
  };
}