
import angularFilters from './filter-angular';
import * as dateFilter from './filter-date';
import * as numberFilter from './filter-number';
import * as stringFilter from './filter-string';

window.angularFilters = angularFilters;
window.tkgFilter = {
  filterFormatDate: dateFilter.filterFormatDate,
  filterFormatDateTime: dateFilter.filterFormatDateTime,
  filterFormatUnixTime: dateFilter.filterFormatUnixTime,
  filterFormatTime: dateFilter.filterFormatTime,
  filterFormatNanoTime: dateFilter.filterFormatNanoTime,
  filterThresholdDecimal: numberFilter.filterThresholdDecimal,
  filterDecimal: numberFilter.filterDecimal,
  filterFormatNumber: numberFilter.filterFormatNumber,
  filterFormatNonZero: numberFilter.filterFormatNonZero,
  filterPercentage: numberFilter.filterPercentage,
  filterNewCurrency: numberFilter.filterNewCurrency,
  filterPriceThresholdDecimal: numberFilter.filterPriceThresholdDecimal,
  filterPriceBaseOnKey: numberFilter.filterPriceBaseOnKey,
  filterShortHand: stringFilter.filterShortHand,
  filterCamelCase: stringFilter.filterCamelCase,
  filterCamelSplitString: stringFilter.filterCamelSplitString,
  filterSplitString: stringFilter.filterSplitString,
  filterBoolean: stringFilter.filterBoolean,
  filterTradeType: stringFilter.filterTradeType,
  filterRating: stringFilter.filterRating,
  filterExceptionStatus: stringFilter.filterExceptionStatus,
  filterFixedIncomeCategory: stringFilter.filterFixedIncomeCategory,
  filterQuoteStatus: stringFilter.filterQuoteStatus,
  filterQuoteBidStatus: stringFilter.filterQuoteBidStatus,
  filterAcceptedRejected: stringFilter.filterAcceptedRejected,
  filterComparator: stringFilter.filterComparator,
};

angular.module('tkgCommon')
  .filter('filterFormatDate', () => { return dateFilter.filterFormatDate; })
  .filter('filterFormatDateTime', () => { return dateFilter.filterFormatDateTime; })
  .filter('filterFormatUnixTime', () => { return dateFilter.filterFormatUnixTime; })
  .filter('filterFormatTime', () => {return dateFilter.filterFormatTime; })
  .filter('filterFormatNanoTime', () => {return dateFilter.filterFormatNanoTime; })
  .filter('filterThresholdDecimal', () => {return numberFilter.filterThresholdDecimal; })
  .filter('filterDecimal', () => {return numberFilter.filterDecimal; })
  .filter('filterFormatNumber', () => {return numberFilter.filterFormatNumber; })
  .filter('filterFormatNonZero', () => {return numberFilter.filterFormatNonZero; })
  .filter('filterPercentage', () => {return numberFilter.filterPercentage; })
  .filter('filterNewCurrency', () => {return numberFilter.filterNewCurrency; })
  .filter('filterPriceThresholdDecimal', () => {return numberFilter.filterPriceThresholdDecimal; })
  .filter('filterPriceBaseOnKey', () => {return numberFilter.filterPriceBaseOnKey; })
  .filter('filterShortHand', () => {return stringFilter.filterShortHand; })
  .filter('filterCamelCase', () => { return stringFilter.filterCamelCase; })
  .filter('filterCamelSplitString', () => { return stringFilter.filterCamelSplitString; })
  .filter('filterSplitString', () => { return stringFilter.filterSplitString; })
  .filter('filterBoolean', () => { return stringFilter.filterBoolean; })
  .filter('filterTradeType', () => { return stringFilter.filterTradeType; })
  .filter('filterRating', () => { return stringFilter.filterRating; })
  .filter('filterExceptionStatus', () => { return stringFilter.filterExceptionStatus; })
  .filter('filterFixedIncomeCategory', () => { return stringFilter.filterFixedIncomeCategory; })
  .filter('filterQuoteStatus', () => { return stringFilter.filterQuoteStatus; })
  .filter('filterQuoteBidStatus', () => { return stringFilter.filterQuoteBidStatus; })
  .filter('filterAcceptedRejected', () => { return stringFilter.filterAcceptedRejected; })
  .filter('filterComparator', () => { return stringFilter.filterComparator; })

