export let LOGIN_PATH = '/login';

export class Session {
  constructor () {}
  removeCredential () {
    a.$cookies.remove('tkg-token');
  }
  storeCredential (token) {
    a.$cookies.put('tkg-token', token);
  }
  getCredential () {
    return a.$cookies.get('tkg-token');
  }
}

export class NewLoginSrv extends Session {
  constructor (tkgConfig) {
    super();
    this.apiUrl = tkgConfig.getApiUrl();
    this.loginUrl = `${tkgConfig.getApiUrl()}/login`;
    this.userInfoUrl = this.loginUrl.replace('/login', '/find');
    this.loginRoute = null;
  }
  setUrl (apiUrl, loginUrl, userInfoUrl) {
    this.apiUrl = apiUrl
    this.loginUrl = loginUrl || `${apiUrl}/login`;
    this.userInfoUrl = userInfoUrl;
  }
  login (obj) {
    return a.$http({
      method: 'PUT',
      url: this.loginUrl,
      data: obj
    }).then((res) => {
      this.storeCredential(obj);
      return res;
    });
  }
  refreshToken (token) {
    return a.$http({
      method: 'GET',
      url: `${this.apiUrl}/refresh/${token}`
    });
  }
  logout () {
    this.removeCredential();
    this.toLogin();
    setTimeout(() => {
      location.reload();
    });
  }
  toLogin () {
    this.removeCredential();
    let currentPath = a.$location.path();
    if(currentPath !== LOGIN_PATH) {
      a.$location.path(LOGIN_PATH).replace();
      return true;
    }
    return false;
  }
  toLoginIfNotLoggedIn () {
    if(!this.getCredential()) {
      return this.toLogin();
    }
    return true;
  }
  fetchUser () {
    return a.$http({
      method: 'GET',
      url: this.userInfoUrl + `/${this.getCredential()}`
    });
  }
}
