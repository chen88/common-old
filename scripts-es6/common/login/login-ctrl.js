export class LoginCtrl {
  constructor ($scope, loginService, $timeout, session) {
    'ngInject';
    this.loginService = loginService;
    this.$timeout = $timeout;
    this.session = session;

    this.user = {
      username: '',
      password: ''
    }

    var keypress = (evt) => {
      if(evt.keyCode === 13 && this.user.username && this.user.password && !this.loggingIn) {
        this.login();
      }
    };

    let windowE = $(window);
    windowE.on('kepress', keypress);
    $scope.$on('$destroy', () => {
      windowE.off('keypress', keypress);
    })

  }
  login () {
    this.loggingIn = true;
    this.loginService.login(this.user.username, this.user.password)
      .then((user) => {
        this.nickname = user ?  user.realName : null;
        this.success = true;
        this.error = false;
        this.$timeout.cancel(this.errorTimeoutId);
        this.$timeout(() => {
          this.loginService.redirectToHome();
        }, 1000);
      }, () => {
        this.error = true;
        this.loggingIn = false;
        this.session.removeToken();
        this.$timeout.cancel(this.errorTimeoutId);
        this.errorTimeoutId = this.$timeout(() => {
          this.error = false;
        }, 3000);
      });
  }
}

export function loginRouteProvider ($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/login', {
      templateUrl: 'common/login/login.html',
      controller: LoginCtrl,
      controllerAs: 'loginCtrl'
    })
    .when('/password', {
      templateUrl: 'common/login/change-password.html',
      controller: PasswordCtrl,
      controllerAs: 'pwCtrl',
      resolve: {
        grid: function ($q, loginService, tkgConfig) {
          if(!loginService.validateLogin()) {
            loginService.redirectToLogin();
            return $q.reject();
          }
          tkgConfig.setOneGrid( 'common/login/change-password-body.html');
        }
      }
    });
}

export class PasswordCtrl {
  constructor (loginService, $timeout) {
    'ngInject';
    this.loginService = loginService;
    this.$timeout = $timeout;
    this.oldPw = '';
    this.newPw = '';
    this.confirmedPw = '';
  }
  changePw () {
    if(!this.validate()) {
      return;
    }
    this.updating  = true;
    this.loginService.changePw(this.oldPw, this.newPw).then(() => {
      this.success = true;
      this.$timeout(() => {
        this.loginService.redirectToHome();
      }, 10000);
    }, () => {
      this.error = true;
    }).finally(() => {
      this.updating = false;
      this.$timeout(() => {
        this.success = false;
        this.error = false;
      }, 10000);
    });
  }
  validate () {
    this.userName = this.userName || this.loginService.user.userName;
    let newPw = this.newPw;
    this.errorMsg = '';
    if(!this.oldPw || !newPw || !this.confirmedPw) {
      this.errorMsg = 'Some fields are missing.';
      return false;
    }
    if(this.oldPw === newPw) {
      this.errorMsg = 'New password should not be the same as old password.';
      return false;
    }
    if(newPw !== this.confirmedPw) {
      this.errorMsg = 'Password does not match the confirm password.';
      return false;
    }
    let clearnNewPw = newPw.replace(/[^a-zA-Z]/g, '');
    let clearUserName = this.userName.replace(/[^a-zA-Z]/g, '');
    let containsUserName = clearnNewPw.indexOf(clearUserName) > -1;
    if(/\s/.test(newPw) || containsUserName) {
      this.errorMsg = 'Password should not contain spaces or username';
      return false;
    }
    let isSafe = newPw.length >= 8 && /[`!#$%^&*,.~\[\]\?]/.test(newPw) && /[a-z]/.test(newPw) && /[A-Z]/.test(newPw);
    if(!isSafe) {
      this.errorMsg = 'Password must have a mininum of 8 characters with at least 1 uppercase and 1 lowercase alphabetic character and 1 special symbol (! ` # $ & % ^ , .)';
      return false;
    }
    return true;
  }
  validateWithoutSpecialSymbol () {
    this.userName = this.userName || this.loginService.user.userName;
    let newPw = this.newPw;
    this.errorMsg = '';
    if(!this.oldPw || !newPw || !this.confirmedPw) {
      this.errorMsg = 'Some fields are missing.';
      return false;
    }
    if(this.oldPw === newPw) {
      this.errorMsg = 'New password should not be the same as old password.';
      return false;
    }
    if(newPw !== this.confirmedPw) {
      this.errorMsg = 'Password does not match the confirm password.';
      return false;
    }
    let hasSpecialCharacter = /[^a-zA-Z0-9]/.test(newPw);
    if(hasSpecialCharacter) {
      this.errorMsg = 'Password should not contain special characters';
      return false;
    }
    let clearnNewPw = newPw.replace(/[^a-zA-Z]/g, '');
    let clearUserName = this.userName.replace(/[^a-zA-Z]/g, '');
    let containsUserName = clearnNewPw.indexOf(clearUserName) > -1;
    if(hasSpecialCharacter || containsUserName) {
      this.errorMsg = 'Password should not contain username';
      return false;
    }
    let isSafe = newPw.length >= 8 && /[a-z]/.test(newPw) && /[A-Z]/.test(newPw) && /[0-9]/.test(newPw);
    if(!isSafe) {
      this.errorMsg = 'Password must have mininum of 8 characters with at least 1 uppercase and 1 lowercase alphabetic character, and 1 number. (No special characters)';
      return false;
    }
    return true;
  }
}

export function changePwRunBlock ($rootScope, $location, loginService) {
  'ngInject';
  if(!tkgConst.enableDirtyPassword) {
    return;
  }
  loginService.getUserInfo().then((user) => {
    $rootScope.currentUser = user;
  });

  let watcher = $rootScope.$watch('currentUser', (user) => {
    if(user && user.dirtyPassword === true) {
      watcher();
      loginService.redirectToPassword();
    }
  })
}
