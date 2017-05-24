import {tkgHelper} from './../constants/helper';
import {injector} from './../constants/injector';
/**
 * $http({
 *   transformRequest: tkgHelper.appendTransformResponse(function (data) { return data; }),
 *   transformResponse: tkgHelper.appendTransformRequest(function (data) { return data; })
 * })
 */

let $http = injector.get('$http');
let defaultTransformResponse = $http.defaults.transformResponse || [];
let defaultTransformRequest = $http.defaults.transformRequest || [];
!Array.isArray(defaultTransformResponse) ? [defaultTransformResponse] : null;
!Array.isArray(defaultTransformRequest) ? [defaultTransformRequest] : null;

function appendTransformResponse (func) {
  let newTransformResponses = _.cloneDeep(defaultTransformResponse);
  newTransformResponses.push(func);
  return newTransformResponses;
}

function appendTransformRequest (func) {
  let newTransformRequests = _.cloneDeep(defaultTransformRequest);
  newTransformRequests.push(func);
  return newTransformRequests;
}

function prependTransformResponse (func) {
  let newTransformResponses = _.cloneDeep(defaultTransformResponse);
  newTransformResponses.unshift(func);
  return newTransformResponses;
}

function prependTransformRequest (func) {
  let newTransformRequests = _.cloneDeep(defaultTransformRequest);
  newTransformRequests.unshift(func);
  return newTransformRequests;
}

tkgHelper.appendTransformResponse = appendTransformResponse;
tkgHelper.appendTransformRequest = appendTransformRequest;
tkgHelper.prependTransformResponse = prependTransformResponse;
tkgHelper.prependTransformRequest = prependTransformRequest;

let JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
let APPLICATION_JSON = 'application/json';
let JSON_START = /^\[|^\{(?!\{)/;
let JSON_ENDS = {
  '[': /]$/,
  '{': /}$/
};

function isJsonLike(str) {
    var jsonStart = str.match(JSON_START);
    return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
}

function defaultHttpResponseTransform(data, headers) {
  if (isString(data)) {
    // Strip json vulnerability protection prefix and trim whitespace
    var tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();

    if (tempData) {
      var contentType = headers('Content-Type');
      if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || isJsonLike(tempData)) {
        data = fromJson(tempData);
      }
    }
  }

  return data;
}

export let tkgInterceptor = 'tkgInterceptor';

angular.module(tkgInterceptor, [])
  .config(($httpProvider) => {
    $httpProvider.defaults.transformResponse.unshift((data, headers) => {
      if(typeof(data) === 'string') {
        let tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();
        if(tempData) {
          let contentType = headers('Content-Type');
          if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || isJsonLike(tempData)) {
            try {
              data = JSON.parse(data);
            } catch (e) {
              data = {
                error: data
              };
            }
          }
        }
      }
      return data;
    });
  })

/**
 * Adding authorization to the header to avoid setting header in every request
 */

  .factory('loginTokenInterceptor', (session) => {
    return {
      request: (config) => {
        config.headers = _.assign(session.getAuthorization(), config.headers);
        let url = config.url;
        if((config.headers.emulate || config.headers.become) && !/sentinel/.test(url)) {
          delete config.headers.emulate;
          delete config.headers.become;
        }
        return config;
      }
    }
  })
  .config(($httpProvider) => {
    if(!tkgConst.disableBasicAuth) {
      $httpProvider.interceptors.push('loginTokenInterceptor');
    }
  });
