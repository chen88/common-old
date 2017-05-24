export function autofocus () {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs, model) {
      var ele = element[0];
      setTimeout(() => {
        function focus () {
          // element.focus();
          // element.val(element.val());
          let val = element.val() || '';
          let position = val.length;
          if(ele.setSelectionRange) {
            ele.focus();
            ele.setSelectionRange(position, position);
          } else if(ele.createTextRange) {
            var range = ele.createTextRange();
            range.collapse(true);
            range.moveEnd('character', position);
            range.moveStart('character', position);
            range.select();
          }
        }
        focus();
        if(attrs.autofocus) {
          $scope.$watch(attrs.autofocus, (val) => {
            if(val) {
              setTimeout(() => {
                focus();      
              }, 100);
            }
          })
        }
      });
    }
  };
}