export class ScoutConfigService {
  constructor ($q, $http, tkgConfig) {
    'ngInject';
    this.$q = $q;
    this.$http = $http;
    this.tkgConfig = tkgConfig;
  }
  getApiUrl () {
    return this.tkgConfig.getApiUrl();
  }
  getStrategyList () {
    if(this.stratList) {
      return this.$q.resolve(this.stratList);
    }
    return this.$http({
      method: 'GET',
      url: `${this.getApiUrl()}/strategies`
    }).then((res)=> {
      this.stratList = res;
      return this.stratList;
    });
  }
  fetchStrategy (strat) {
    return this.$http({
      method: 'GET',
      url: `${this.getApiUrl()}/strategy/${strat}`
    });
  }
  modifyStrategy(strat, stratDetail) {
    return this.$http({
      method: 'POST',
      url: `${this.getApiUrl()}/strategy/${strat}`,
      data: stratDetail
    });
  }
}

export class ScoutLiveTradeService extends ScoutConfigService {
  constructor ($q, $http, tkgConfig) {
    'ngInject';
    super($q, $http, tkgConfig);
  }
  getLiveApiUrl () {
    return window.traderUrl;
  }
  fetchTickets (requestParams) {
    return this.$http({
      method: 'GET',
      url:`${this.getApiUrl()}/tickets`,
      params: requestParams
    });
  }
  updateQuotePrice (id, price) {
    return this.$http({
      method: 'GET',
      url: `${this.getLiveApiUrl()}/updateQuotePrice/${id}`,
      params: {
        price: price
      }
    });
  }
  revertUserModifiedQuote (id) {
    return this.$http({
      method: 'GET',
      url: `${this.getLiveApiUrl()}/revertUserModifiedQuote/${id}`
    });
  }
  cancelQuote (id) {
    return this.$http({
      method: 'GET',
      url: `${this.getLiveApiUrl()}/cancelQuote/${id}`
    });
  }
  toggleApproved (id) {
    return this.$http({
      method: 'GET',
      url: `${this.getLiveApiUrl()}/toggleApproved/${id}`,
      ignoreLoadingBar: true
    });
  }
  togglePass (id) {
    return this.$http({
      method: 'GET',
      url: `${this.getLiveApiUrl()}/togglePass/${id}`,
      ignoreLoadingBar: true
    });
  }
  toggleReviewed (id) {
    return this.$http({
      method: 'GET',
      url: `${this.getLiveApiUrl()}/toggleReviewed/${id}`,
      ignoreLoadingBar: true
    });
  }
  lastUpdateTime () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/lastUpdateTime`,
      ignoreLoadingBar: true
    });
  }
  isBiddingEnabled () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/isBiddingEnabled`,
    });
  }
  enableBidding () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/enableBidding`,
    });
  }
  disableBidding () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/disableBidding`,
    });
  }
  isManualModeEnabled () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/isManualModeEnabled`,
    });
  }
  enableManualMode () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/enableManualMode`,
    });
  }
  disableManualMode () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/disableManualMode`,
    });
  }
  getServerTime () {
    return this.$http({
      method: 'GET',
      url:`${this.getLiveApiUrl()}/currentTime`,
      ignoreLoadingBar: true
    });
  }
  getFakeQuote () {
    return this.$http({
      method: 'GET',
      url: '/quotes_mock',
    });
  }
}

export class ScoutInteractiveService extends ScoutLiveTradeService {
  constructor ($q, $http, tkgConfig) {
    'ngInject';
    super($q, $http, tkgConfig);
  }
  /**
   * [fetchLogs the historic quotes]
   * @param  {Object} requestParams {
   *                                from: ISO Date
   *                                to: ISO Date
   * }
   * @return {[type]}               [description]
   */
  fetchLogs (requestParams) {
    return this.$http({
      method: 'GET',
      url:`${this.getApiUrl()}/strategy/log`,
      params: requestParams
    });
  }
  saveLog (requestParams) {
    return this.$http({
      method: 'GET',
      url:`${this.getApiUrl()}/strategy/${requestParams.strategy}/quote/${requestParams.cusip}`,
      params: {
        quantity: requestParams.quantity,
        asOf: requestParams.asOf
      }
    });
  }
}

export default class ScoutSerivce extends ScoutInteractiveService {
  constructor ($q, $http, tkgConfig) {
    'ngInject';
    super($q, $http, tkgConfig);
  }
}
