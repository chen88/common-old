export class userPreference {
  constructor ($http, $q, tkgConfig) {
    this.$http = $http;
    this.$q = $q;
    let basePrefUrl = tkgConfig.getSentinelApiUrl() || tkgConfig.getApiUrl();
    this.prefUrl = basePrefUrl ?  `${basePrefUrl}/pref` : null;
    this.preference = {};
  }
  transformRequest (data) {
    if(data.hasOwnProperty('prefData')) {
      try {
        data = angular.copy(data);
        data.prefData = JSON.stringify(data.prefData);
      } catch (e) {
        data.prefData = undefined;
      }
    }

    return data;
  }
  transformResponse (data) {
    if(data.hasOwnProperty('prefData')) {
      try {
        data.prefData = JSON.parse(data.prefData);
      } catch (e) {
        data.prefData = {};
      }
    }

    return data;
  }
  fetch () {
    if(!this.prefUrl) {
      return this.$q.reject();
    }
    return this.$http({
      method: 'GET',
      url: this.prefUrl,
      ignoreLoadingBar: true,
      transformResponse: tkgHelper.appendTransformResponse(this.transformResponse)
    }).then((res) => {
      this.preference = res.data;
      return _.get(this.preference, 'prefData') || this.preference;
    });
  }
  save(preference) {
    if(!this.prefUrl) {
      return this.$q.reject();
    }
    if(_.isEmpty(this.preference)) {
      return this.$q.reject();
    }
    if(this.preference.hasOwnProperty('prefData')) {
      _.assign(this.preference.prefData, preference);
    } else {
      _.assign(this.preference, preference);
    }

    return this.$http({
      method: 'POST',
      url: this.prefUrl,
      data: this.preference,
      transformRequest: tkgHelper.prependTransformRequest(this.transformRequest),
      transformResponse: tkgHelper.appendTransformResponse(this.transformResponse)
    }).then((res) => {
      _.assign(this.preference, res.data);
      return this.preference;
    });
  }
  get () {
    if(!this.prefUrl) {
      return this.$q.resolve(this.preference);
    }
    if(!_.isEmpty(this.preference)) {
      return this.$q.resolve(_.get(this.preference, 'prefData') || this.preference);
    } else {
      return this.fetch();
    }
  }
  clearPreference () {
    this.preference = null;
  }
}

export class cusipAutoFillManager {
  constructor ($q, userPreference) {
    this.$q = $q;
    this.userPreference = userPreference;
    this.cusipRecords = [];
  }
  saveCusip (pricing) {
    if(!pricing.cusip || _.isEqual(_.head(this.cusipRecords), pricing)) {
      return this.$q.resolve(this.cusipRecords);
    }
    _.remove(this.cusipRecords, {cusip: pricing.cusip});
    this.cusipRecords.unshift(pricing);
    return this.userPreference.save({
      cusipRecords: angular.copy(this.cusipRecords)
    }).then(() => {
      return this.cusipRecords;
    });
  }
  getSearchedRecord () {
    if(!_.isEmpty(this.cusipRecords)) {
      return this.$q.resolve(this.cusipRecords);
    }
    return this.userPreference.get().then((preference) => {
      let cusipRecords = preference.cusipRecords || [];
      _.remove(cusipRecords, {cusip: null});
      cusipRecords = _.uniqBy(cusipRecords, 'cusip');
      this.cusipRecords = angular.copy(cusipRecords);
      return this.cusipRecords;
    });
  }
  clearRecord () {
    this.cusipRecords.length = 0;
  }
}

export class CusipAutoFillCtrl {
  constructor ($scope, $parse, cusipAutoFillManager, $attrs) {
    this.$scope = $scope;
    this.ngModelHandler = $parse($attrs.ngModel);

    cusipAutoFillManager.getSearchedRecord().then((cusipRecords) => {
      this.cusipRecords = cusipRecords;
    });
  }
  setModel (cusip) {
    this.ngModelHandler.assign(this.$scope, cusip);
  }
}

export function cusipAutoFill (cusipAutoFillManager) {
  return {
    restrict: 'E',
    templateUrl: (tE, tAttr) => {
      if(!tAttr.ngModel) {
        throw new Error('Missing ngModel attribute at cusip-auto-fill');
      }
      return 'common/login/cusip-auto-fill.html';
    },
    controller: CusipAutoFillCtrl,
    controllerAs: 'cusipAutoFillCtrl',
  };
}
