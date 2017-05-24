export default function errorInterceptor ($q, $rootScope) {
  return {
    responseError: (rejection) => {

      if(!tkgConst.isProd()) {
        let alert = {type: 'danger'};
        let msg = '';

        switch (rejection.status) {
          case 400:
            break;
          case 401:
            msg = 'Invalid usename or password.';
            break;
          case 403:
            msg = `You don't have permission to do this.`;
            break;
          case 404:
            if(!/not found/i.test(_.get(rejection, 'data.message'))) {
              msg = 'Value not found.';
            }
            break;
          case 500:
            msg = 'Internal server error: ' + JSON.stringify(rejection.data);
            break;
        }

        if(msg) {
          alert.msg = msg;
          $rootScope.addAlert(alert);
        }
      }


      return $q.reject(rejection);
    }
  }
}
