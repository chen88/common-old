import errorInterceptor from './error-interceptor';
import alertBox from './error-msg';
import {errorRunBlock} from './error-msg';
import modalMessage from './error-modal';

export let errorModule = 'errorModule';
angular.module(errorModule, [])
  .config(($httpProvider) => {
    if(!tkgConst.hideErrorInterceptor) {
      $httpProvider.interceptors.push(errorInterceptor);
    }
  })
  .directive('alertBox', alertBox)
  .run(errorRunBlock)
  .service('modalMessage', modalMessage);
