export function tkgAutoCorrect () {
  return {
    require: 'ngModel',
    link: function ($scope, element, attrs, model) {
      var autoCorrectType = attrs.tkgAutoCorrect;
      var parser = angular.noop;

      switch (autoCorrectType) {
        case 'number':
          parser = function (value) {
            return value.replace(/\D/g, '');
          };
          break;
        case 'floatingNumber':
          parser = function (value) {
            return value.replace(/[^\d.]/g, '');
          };
          break;
        case 'letterNumber':
          parser = function (value) {
            return value.replace(/[\W_]/g, '');
          };
          break;
        case 'letterSpaceNumber':
          parser = function (value) {
            return value.replace(/[^A-Za-z0-9\s]/g, '');
          };
          break;
        case 'letter':
          parser = function (value) {
            return value.replace(/[^a-zA-Z]/g, '')
          };
          break;
        case 'price':
          parser = function (value) {
            return value.replace(/[^$\d.,]/g, '');
          };
          break;
      }

      var extendedParser = parser;
      parser = function (value) {
        // removeError();
        var originalValue = value;
        value = extendedParser(value);
        if(originalValue !== value) {
          model.$setViewValue(value);
          model.$render();
        }
        return value;
      };
      model.$parsers.unshift(parser);
    }
  };
}