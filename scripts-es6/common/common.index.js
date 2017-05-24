import {tkgConst} from './constants/tkg-const';
import {tkgHelper} from './constants/helper';
import {loginModule} from './login/login.index';
import {tkgInterceptor} from './interceptors/interceptor.index';
import {tkgValidation} from './validation/validation.index';
import {tkgProviders} from './providers/provider.index';
import {tkgCommonDir} from './directives/common-directive.index';
import {tkgGridModule} from './grid/grid.index';
import {errorModule} from './error/error.index';
import * as ST from './scrollable-table/scrollable-table';
import * as ST_V2 from './scrollable-table-v2/scrollable-table';
import * as Sort from './list-sort/sort-by-arrow';
import {modalPrompt} from './modal-prompt/modal-prompt';

if(moment && typeof moment().subtractWeekDays !== 'function') {
  console.warn('please include momentjs business in bower.json --\n "moment-business": "~2.0.0"');
}

window.a = window.angularServices = {};

export const tkgCommonModule = 'tkgCommon';

angular.module(tkgCommonModule, [
  tkgProviders,
  tkgCommonDir,
  errorModule,
  loginModule,
  tkgInterceptor,
  tkgValidation,
  tkgGridModule
])
  .constant('angularMomentConfig', {
    timezone: 'America/New_York'
  })
  .constant('prepareWindowEvents', tkgConst.prepareWindowEvents)
  .service('modalPrompt', modalPrompt)
  .directive('tkgScrollableTable', ST.ScrollableTable)
  .directive('thead', ST.ScrollableHeader)
  .directive('watchStyle', ST.WatchStyle)
  .directive('resizableColumn', ST.resizableColumn)
  .directive('th', ST.swappableColumnHeader)

  .directive('removeableColumn', ST.remoavableColumn)
  .directive('th', ST.removableColumnHeader)
  .directive('colResizer', ST.colResizer)
  .directive('td', ST.ScrollableBodyCell)

  .directive('scrollableTableS', ST_V2.ScrollableTableS)

  .directive('tkgSort', Sort.TkgSort)
  .directive('tkgSortUp', Sort.TkgSortUp)
  .directive('tkgSortDown', Sort.TkgSortDown)

  .config(($sceProvider, $uibTooltipProvider, $httpProvider, $locationProvider, uibDatepickerConfig, uibDatepickerPopupConfig) => {
    $locationProvider.html5Mode({enabled: false, requireBase: false});
    $locationProvider.hashPrefix('');

    $sceProvider.enabled(false);

    $uibTooltipProvider.options({
      appendToBody: true,
      placement: 'bottom'
    });

    _.assign(uibDatepickerConfig, {
      showWeeks: false,
      dateDisabled: function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      },
    });

    _.assign(uibDatepickerPopupConfig, {
      datepickerPopup: 'MM/dd/yyyy',
      showButtonBar: false,
      datepickerAppendToBody: true,
      appendToBody: true,
      dateDisabled: function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      },
    });

    $httpProvider.defaults.cache = false;
  })
  .run(($rootScope, $filter, $compile, $q, $http, $cookies, $timeout, $location, $interval, $uibModal, $parse, modalMessage, tkgConfig, modalPrompt) => {
    _.extend(a, {
      $rootScope,
      $filter,
      $compile,
      $q,
      $http,
      $cookies,
      $timeout,
      $location,
      $interval,
      $uibModal,
      $parse
    });
    _.extend($rootScope, {
      tkgConst,
      tkgHelper,
    });

    $rootScope.dateNgModelOptions = {};
    tkgConst.datepickerOptions = $rootScope.datepickerOptions = {
      dateDisabled: function (date) {
        var mode = date.mode;
        date = date.date;
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      }
    };
    tkgConst.modalPrompt = modalPrompt;
    tkgConst.tkgConfig = tkgConfig;
    tkgHelper.modalMessage = modalMessage;
  })

Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  },
  colors: [
    '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
    '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1', '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce'
  ]
});
