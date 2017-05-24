const usStates = [
  { name: 'ALABAMA', abbr: 'AL'},
  { name: 'ALASKA', abbr: 'AK'},
  { name: 'AMERICAN SAMOA', abbr: 'AS'},
  { name: 'ARIZONA', abbr: 'AZ'},
  { name: 'ARKANSAS', abbr: 'AR'},
  { name: 'CALIFORNIA', abbr: 'CA'},
  { name: 'COLORADO', abbr: 'CO'},
  { name: 'CONNECTICUT', abbr: 'CT'},
  { name: 'DELAWARE', abbr: 'DE'},
  { name: 'DISTRICT OF COLUMBIA', abbr: 'DC'},
  { name: 'FEDERATED STATES OF MICRONESIA', abbr: 'FM'},
  { name: 'FLORIDA', abbr: 'FL'},
  { name: 'GEORGIA', abbr: 'GA'},
  { name: 'GUAM', abbr: 'GU'},
  { name: 'HAWAII', abbr: 'HI'},
  { name: 'IDAHO', abbr: 'ID'},
  { name: 'ILLINOIS', abbr: 'IL'},
  { name: 'INDIANA', abbr: 'IN'},
  { name: 'IOWA', abbr: 'IA'},
  { name: 'KANSAS', abbr: 'KS'},
  { name: 'KENTUCKY', abbr: 'KY'},
  { name: 'LOUISIANA', abbr: 'LA'},
  { name: 'MAINE', abbr: 'ME'},
  { name: 'MARSHALL ISLANDS', abbr: 'MH'},
  { name: 'MARYLAND', abbr: 'MD'},
  { name: 'MASSACHUSETTS', abbr: 'MA'},
  { name: 'MICHIGAN', abbr: 'MI'},
  { name: 'MINNESOTA', abbr: 'MN'},
  { name: 'MISSISSIPPI', abbr: 'MS'},
  { name: 'MISSOURI', abbr: 'MO'},
  { name: 'MONTANA', abbr: 'MT'},
  { name: 'NEBRASKA', abbr: 'NE'},
  { name: 'NEVADA', abbr: 'NV'},
  { name: 'NEW HAMPSHIRE', abbr: 'NH'},
  { name: 'NEW JERSEY', abbr: 'NJ'},
  { name: 'NEW MEXICO', abbr: 'NM'},
  { name: 'NEW YORK', abbr: 'NY'},
  { name: 'NORTH CAROLINA', abbr: 'NC'},
  { name: 'NORTH DAKOTA', abbr: 'ND'},
  { name: 'NORTHERN MARIANA ISLANDS', abbr: 'MP'},
  { name: 'OHIO', abbr: 'OH'},
  { name: 'OKLAHOMA', abbr: 'OK'},
  { name: 'OREGON', abbr: 'OR'},
  { name: 'PALAU', abbr: 'PW'},
  { name: 'PENNSYLVANIA', abbr: 'PA'},
  { name: 'PUERTO RICO', abbr: 'PR'},
  { name: 'RHODE ISLAND', abbr: 'RI'},
  { name: 'SOUTH CAROLINA', abbr: 'SC'},
  { name: 'SOUTH DAKOTA', abbr: 'SD'},
  { name: 'TENNESSEE', abbr: 'TN'},
  { name: 'TEXAS', abbr: 'TX'},
  { name: 'UTAH', abbr: 'UT'},
  { name: 'VERMONT', abbr: 'VT'},
  { name: 'VIRGIN ISLANDS', abbr: 'VI'},
  { name: 'VIRGINIA', abbr: 'VA'},
  { name: 'WASHINGTON', abbr: 'WA'},
  { name: 'WEST VIRGINIA', abbr: 'WV'},
  { name: 'WISCONSIN', abbr: 'WI'},
  { name: 'WYOMING', abbr: 'WY' }
];

export let tkgConst = {
  timezone: 'America/New_York',
  localTimezone: moment.tz.guess(),
  setDefaultTimeZone: function (timezone) {
    timezone = timezone ||  'America/New_York';
    moment.tz.setDefault("America/New_York");
    _.assign(tkgConst.datepickerOptions, {
      ngModelOptions: {timezone: '-05:00'}
    });
    a.$rootScope.dateNgModelOptions = {
      timezone: '-05:00'
    };
  },
  setDefaultHighChartTimeZone: function () {
    Highcharts.setOptions({
      global: {
        getTimezoneOffset: function (timestamp) {
            var zone = 'America/New_York',
                timezoneOffset = -moment.tz(timestamp, zone).utcOffset();

            return timezoneOffset;
        },
      }
    });
  },

  restApiUrl: '',

  getDefaultApiUrl: function () {
    if(!window.tkgConst.isLocalhost()) {
      return window.location.origin + '/api';
    }
    return false;
  },

  isLocalhost: function (url) {
    url = url || window.location.origin;
    if(/localhost/i.test(url) || (url.match(/\./g) && url.match(/\./g).length >= 3)) {
      return true;
    }
    return false;
  },

  isDev: function () {
    if(/-dev/i.test(window.location.origin)) {
      return true;
    }
    return false;
  },

  isProd: function () {
    if(this.isLocalhost() || this.isDev()) {
      return false;
    }
    return true;
  },

  stringToPixel: function (str, fontSize) {
    if(str && str.length) {
      fontSize = fontSize || 14;
      let additional = 1;
      if(str.length < 10) {
        additional = 2
      }
      let size = fontSize / 2 + additional;
      return str.length * size;
    }
    return 0;
  },

  mock: false,
  hideErrorInterceptor: false,

  maximized: false,
  enableDirtyPassword: false,

  singleGrid: {
    minimizable: true
  },
  numberOfRows: 50,
  size: {
    header: 60,
    padding: 5,
    scrollbar: 10,
    defaultScrollbar: 17,
    primaryBorder: 4,
    /** Grid **/
    primaryLeftGrid: 200,
    tiertaryLeftGrid: 300,
    minimumGridSize: 200,
    /** Single Scrollable Grid **/
    singleGridHeight: 415,
    singleGridBorder: 3,

    /** Panel **/
    panelBorder: 1,
    panelHeading: 38,
    tab: 35,
    tabAndHeading: 63,

    /** ScrollableTable **/
    tableHead: 25,
    thWidth: 80,
    horizontalCellPadding: 5,
    verticalCellPadding: 2,
    cellBorder: 1,
    minCellWidth: 10,
    resizerWidth: 10,
  },

  timeout: {
    setPrimaryGrid: 0,
    resizePrimaryBody: 0,
    resizePrimaryGrid: 0,
    setSecondaryGrid: 1,
    setTiertaryBody: 2,
    setTiertaryGrid: 5,
    scrollableTable: 6,
    scrollableBody: 7,
    scrollableCell: 300,
    singleGrid: 1,
    singleGridChild: 2,
    setResizeBar: 100,
    highchart: 200,
    modifyColumn: 500,

    initialLoad: 1000,
    request: 15000,
    loaderFadeTime: 300,
  },

  dateBackSelection: (function () {
    var dateBackArr = [
      {name: 'Now', value: null},
      {name: 'Today', value: 0},
    ];
    for(var i = 1; i <= 10; i++) {
      dateBackArr.push({name: moment().subtractWeekDays(i).format('MM/DD/YYYY'), value: i});
    }
    return dateBackArr;
  })(),

  dateSelection: [
    {name: 'Date Range', value: 'none'},
    {name: 'Last Trading Date', value: 'lastDate'},
    {name: 'Week to Date', value: 'weekToDate'},
    {name: 'Month to Date', value: 'monthToDate'}
  ],

  extendedDateSelection: [
    {name: 'Date Range', value: 'none'},
    {name: 'Last Trading Date', value: 'lastDate'},
    {name: 'Week to Date', value: 'weekToDate'},
    {name: 'Month to Date', value: 'monthToDate'},
    {name: 'Year to Date', value: 'yearToDate'}
  ],

  realtimeDateSelection: [
    {name: 'Date Range', value: 'none'},
    {name: 'Today', value: 'today'},
    {name: 'Last Trading Date', value: 'lastDate'},
    {name: 'Week to Date', value: 'weekToDate'},
    {name: 'Month to Date', value: 'monthToDate'}
  ],

  extendedRealtimeDateSelection: [
    {name: 'Date Range', value: 'none'},
    {name: 'Today', value: 'today'},
    {name: 'Last Trading Date', value: 'lastDate'},
    {name: 'Week to Date', value: 'weekToDate'},
    {name: 'Month to Date', value: 'monthToDate'},
    {name: 'Year to Date', value: 'yearToDate'}
  ],

  dateFormat: {
    default: 'YYYY-MM-DDTHH:mm:ssZ',
    template: 'MM/DD/YYYY hh:mm a',
    input: 'MM/DD/YYYY',
    graph: 'dddd, MMM DD, HH:mm:ss',
    export: 'MM-DD-YYYY h-mma'
  },
  lastDateCalc: 1,
  getDateRange: {
    none: angular.noop,
    today: function (isMoment) {
      var date = moment();
      return {
        from: date.clone().startOf('day').valueOf(),
        to: date.valueOf()
      };
    },
    lastDate: function (isToday, momentObj) {
      var dayToSubtract = isToday ? 0 : tkgConst.lastDateCalc;
      var fromDate = moment();
      if(fromDate.hours() < 7 && fromDate.hours() >= 0) {
        dayToSubtract ++;
      }
      var toDate = moment().subtractWeekDays(dayToSubtract, 'day');
      if(!isToday) {
        toDate.endOf('day');
      }
      fromDate = fromDate.subtractWeekDays(dayToSubtract, 'day').startOf('day');
      if(fromDate.isDST()) {
        fromDate.add(1, 'hour');
      }
      if(momentObj) {
        return {
          from: fromDate,
          to: toDate
        };
      }
      return {
        from: fromDate.valueOf(),
        to: toDate.valueOf()
      };
    },
    weekToDate: function (isToday, momentObj) {
      var date = moment();
      if(isToday) {
        var toDate = date;
        var fromDate = date.clone().startOf('week').addWeekDays(1,'day');
      } else {
        var toDate = date.clone().subtractWeekDays(1, 'day').endOf('day');
        var fromDate = toDate.clone().startOf('week').addWeekDays(1,'day');
        toDate = toDate
      }
      if(fromDate.isDST()) {
        fromDate.add(1, 'hour');
      }
      if(momentObj) {
        return {
          from: fromDate,
          to: toDate
        };
      }
      return {
        from: fromDate.valueOf(),
        to: toDate.valueOf()
      };
    },
    monthToDate: function (isToday, momentObj) {
      var date = moment();
      var fromDate = date.clone().startOf('month');
      var toDate = isToday ? date.valueOf() : date.subtractWeekDays(1, 'day').endOf('day');
      if(fromDate.isDST()) {
        fromDate.add(1, 'hour');
      }
      if(momentObj) {
        return {
          from: fromDate,
          to: toDate
        };
      }
      return {
        from: fromDate.valueOf(),
        to: toDate.valueOf()
      };
    },
    yearToDate: function (isToday, momentObj) {
      var date = moment();
      var fromDate = date.clone().startOf('year');
      var toDate = isToday ? date.valueOf() : date.subtractWeekDays(1, 'day').endOf('day');
      if(fromDate.isDST()) {
        fromDate.add(1, 'hour');
      }
      if(momentObj) {
        return {
          from: fromDate,
          to: toDate
        };
      }
      return {
        from: fromDate.valueOf(),
        to: toDate.valueOf()
      };
    }
  },

  dayRange: {
    min: 9,
    max: 16
  },

  getEndOfToday: function () {
    return moment().hours(tkgConst.dayRange.max).startOf('hour');
  },

  disableWeekend: function (date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  },

  // Prevent Future day
  getStrictDay: function (date) {
    var today = moment();
    var endOfToday = tkgConst.getEndOfToday();

    if(today.diff(date,'days') === 0 && date > endOfToday) {
      return endOfToday;
    } else {
      return date;
    }
  },

  color: {
    poop: '#C3A342',
    green: '#005902',
    lightenPoop: '#f4eedd',
    whiteOpacify: 'rgba(255, 255, 255, 0.7)',
  },

  preventSelection: function (evt) {
    if(evt.stopPropagation) {
      evt.stopPropagation();
    }
    if(evt.preventDefault) {
      evt.preventDefault();
    }
    evt.cancelBubble = true;
    evt.returnValue = false;
    return false;
  },

  isMaximized: function () {
    // window.tkgConst.maximizedEle = window.tkgConst.maximizedEle || $('#tkg-maximized');
    // return window.tkgConst.maximizedEle.css('display') !== 'none';
    return window.tkgConst.maximized;
  },

  isNotLeftClick: function (evt) {
    return evt.which === 2 || evt.which === 3;
  },

  bindEvent: function (element, evt, fn, $scope) {
    element.on(evt, function (e) {
      if(!$scope.$$phase) {
        $scope.$apply(function () {
          fn(e);
        });
      } else {
        fn(e);
      }

    });
    $scope.$on('$destroy', function () {
      element.off(evt, fn);
    });
  },

  back: function () {
    window.history.back();
  },

  states: _.map(usStates, function (state) {return state.abbr; }),

  statesLong: usStates,

  isNaN: function (value) {
    if(!value && value !== 0) {
      return true;
    }
    return isNaN(value.toString().replace(/[,%$]/g, '')) || /[a-zA-Z]/.test(value);
  },

  uuid: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  },

  displayTooltip: function (val, max) {
    max = max || 10;
    if(typeof(val) === 'string' && val.length >= max) {
      return val;
    }
    return null;
  },
  prepareWindowEvents: ($scope, resize) => {
    if(!resize) {
      return;
    }
    $(window).on('resize', resize);
    $scope.$on('$destroy', () => {
      $(window).off('resize', resize);
    });
  }
};

window.tkgConst = tkgConst;