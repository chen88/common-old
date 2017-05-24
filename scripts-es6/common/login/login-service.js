let loginPath = '/login';
let passwordPath = '/password';

export class ClearService {
  constructor (userPreference, cusipAutoFillManager) {
    'ngInject';
    this.userPreference = userPreference;
    this.cusipAutoFillManager = cusipAutoFillManager;
  }
  clear () {
    this.userPreference.clearPreference();
    this.cusipAutoFillManager.clearRecord();
  }
}


export class Session {
  constructor ($cookies) {
    this.$cookies = $cookies;
  }
  removeToken () {
    this.$cookies.remove('tkg-sentinel-token') || this.$cookies.remove('tkg-token');;
  }
  getToken () {
    return this.$cookies.get('tkg-sentinel-token') || this.$cookies.get('tkg-token');
  }
  encodeUser (username, password) {
    let encodedUser = btoa(username + ':' + password);
    this.$cookies.put('tkg-sentinel-token', encodedUser);
    return encodedUser;
  }
  getAuthorization () {
    let headers = {};
    if(this.getToken()) {
      headers['Authorization'] = 'Basic ' + this.getToken();
    } else {
      return headers;
    }
    if(sessionStorage.getItem('emulate')) {
      let emulate = sessionStorage.getItem('emulate');
      headers.emulate = emulate === 'null' || emulate === 'undefined' ? undefined : emulate;
    }
    if(sessionStorage.getItem('become')) {
      let become = sessionStorage.getItem('become');
      headers.become =  become === 'null' || become === 'undefined' ? undefined : become;
    }
    return headers;
  }
}
export class LoginService {
  constructor ($http, $location, $q, tkgConfig, clearService, session) {
    'ngInject';
    this.$http = $http;
    this.$location = $location;
    this.$q = $q;
    this.tkgConfig = tkgConfig;
    this.session = session;
    this.clearService = clearService;
    this.apiUrl = tkgConfig.getApiUrl();
    this.user = {};
  }
  login (username, password) {
    if(username && password) {
      this.session.encodeUser(username, password);
    }
    if(this.loginDefer) {
      return this.loginDefer;
    }
    if(tkgConst.mock) {
      return this.$q.when(true);
    }
    this.loginDefer = this.$http({
      method: 'GET',
      url: `${this.apiUrl}/login`
    }).then((res) => {
      if(!res.data) {
        return $q.reject('Wrong username/password');
      }
      this.user = res.data;
      return this.user;
    }, (res) => {
      if(res.status === -1) {
        return(res);
      }
      this.loginDefer = undefined;
      this.session.removeToken();
      return this.$q.reject(res.data);
    });

    return this.loginDefer
  }
  changePw (oldPw, newPw) {
    return this.$http({
      method: 'POST',
      url: `${this.apiUrl}/password`,
      params: {
        oldPassword: oldPw,
        password: newPw
      }
    }).then((res) => {
      this.session.encodeUser(this.user.userName, newPw);
      return res.data;
    });
  }
  logout () {
    this.session.removeToken();
    sessionStorage.clear();
    if(this.redirectToLogin()) {
      setTimeout(() => {
        location.reload();
      });
    }
  }
  redirectToPassword () {
    this.$location.path(passwordPath);
  }
  redirectToLogin () {
    this.clearService.clear();
    let currentPath = this.$location.path();
    if(currentPath !== loginPath) {
      this.$location.path(loginPath).replace();
      return true;
    }
    return false;
  }
  redirectToHome () {
    this.$location.path('/').replace();
  }
  validateLogin () {
    return !!this.session.getToken() || tkgConst.mock;
  }
  getUserInfo () {
    if(!this.validateLogin()) {
      this.redirectToLogin();
      return this.$q.reject();
    }
    if(!_.isEmpty(this.user)) {
      return this.$q.resolve(this.user);
    }
    return this.login().then((user) => {
      return user;
    }, (err) => {
      if(tkgConst.mock) {
        return err;
      }
      // if(!tkgHelper.isLocalhost()) {
      this.logout();
      // }
      return this.$q.reject(err);
    });
  }
}
