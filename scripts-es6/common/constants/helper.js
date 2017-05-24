export let tkgHelper = {
  isLocalhost: () => {
    if(/localhost/i.test(window.location.origin) || (location.origin.match(/\./g) && location.origin.match(/\./g).length >= 3)) {
      return true;
    }
    return false;
  },
  startsWith: (val, viewValue) => {
    return val.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
  },
  isSafari: () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
};

window.tkgHelper = tkgHelper;