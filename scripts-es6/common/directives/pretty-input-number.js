export function prettyNumber () {
  let numberFilter = angularFilters.number;
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, element, attrs, model) {
      let timeoutId;
      let allowNegative = attrs.negative;
      let numberRegex = allowNegative ? /[^0-9.\-]/g : /[^0-9.]/g;

      // setting view value (3,000.00), but the model stays as a number 3000
      model.$parsers.push((val) => {
        // val = val || '';
        if(val || val === 0 || val === '0') {
          window.clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            val = parseFloat(val.replace(numberRegex, ''));
            val = isNaN(val) || val === null ? '' : val + '';
            // val = numberFilter(val);
            model.$setViewValue(val);
            model.$render();
          }, 1000);
        }
        return (val || '').replace(numberRegex, '');
      });

      // reading from data and to a 3,000.00
      model.$formatters.push((val) => {
        if(val || val === 0 || val === '0') {
          val = parseFloat(val);
        }
        // let formattedNum = numberFilter(val);
        let formattedNum = isNaN(val) || val === null ? '' : val + '';;
        return formattedNum;
      });
    }
  };
}

export function prettyPercent () {
  let numberFilter = angularFilters.number;
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, element, attrs, model) {
      /** if no-conversion === 'true', we don't multiply the model value by 100 */
      let conversion = attrs.noConversion ? 1 : 100;
      /** if show-percent === 'true', we append '%' to view value yet the model remains as a number */
      let showSymbol = attrs.showPercent;
      let timeoutId;
      let formattedVal;

      model.$parsers.push((val) => {
        // val = val || '';
        if(val || val === 0 || val === '0') {
          window.clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            val = parseFloat(val.replace(/[^0-9.]/g, ''));
            formattedVal = (val * conversion) + '%';
            model.$setViewValue(formattedVal);
            model.$render();
          }, 1000);
        }

        return (val || '').replace(/[^0-9.]/g, '');
      });

      model.$formatters.push((val) => {
        if(val || val === 0 || val === '0') {
          val = parseFloat(val);
          formattedVal = (val * conversion) + '%';
          return formattedVal;
        }
        return val;
      });
    }
  }
}

export function tkgEnter () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, element, attrs, model) {
      element.on('keypress', (e) => {
        if(e.keyCode === 13) {
          $scope.$evalAsync(attrs.tkgEnter);
          e.stopPropagation();
          e.preventDefault();
        }
      });
    }
  }
}
