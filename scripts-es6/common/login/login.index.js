import * as loginService from './login-service';
import * as loginCtrl from './login-ctrl';
import * as loginDir from './login-directive';
import * as user from './user';
import * as newLoginSrv from './new-login/new-login-srv';

export let loginModule = 'loginModule';
angular.module(loginModule, [])
  .config(loginCtrl.loginRouteProvider)
  .service('session', loginService.Session)
  .service('loginService', loginService.LoginService)
  .service('clearService', loginService.ClearService)
  .run(loginCtrl.changePwRunBlock)
  .service('userPreference', user.userPreference)
  .service('cusipAutoFillManager', user.cusipAutoFillManager)
  .directive('cusipAutoFill', user.cusipAutoFill)
  .directive('tkgStickyHeader', loginDir.tkgStickyHeader)
  .service('newLoginSrv', newLoginSrv.NewLoginSrv);
