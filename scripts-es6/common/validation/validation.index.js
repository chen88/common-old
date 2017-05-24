import {tkgConst} from './../constants/tkg-const';
export let tkgValidation = 'tkgValidation';

angular.module(tkgValidation, [])
  .constant('COMMON_REPLACE_REGEX', {
    DOUBLE: /[^\d.]/g,
    FLOAT: /[^\d.]/g,
    INT: /\d/g,
  });

tkgConst.validate = {
  cusip: function (cusip) {
    return typeof(cusip) === 'string' && cusip.length === 9;
  },
  email: function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  },
  password: function (password) {
    if(!password || password.lenegth < 8) {
      return false;
    }
    return true;
  }
};