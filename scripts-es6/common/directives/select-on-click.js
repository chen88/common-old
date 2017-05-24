export function selectOnClick () {
  return {
    link: function ($scope, element, attrs) {
      var isFocus = false
        , timer
        ;

      function focus() {
        clearTimeout(timer);
        timer = setTimeout(function () {
          isFocus = true;
        }, 300);
      }
      function blur () {
        isFocus = false;
      }
      function click () {
        if(!isFocus) {
          this.select();
        }
      }
      element
        .on('focus', focus)
        .on('blur', blur)
        .on('click', click);

      $scope.$on('$destroy', function () {
        element.off('focus blur click');
      });
    }
  };
}