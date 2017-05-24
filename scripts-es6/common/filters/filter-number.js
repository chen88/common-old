/**
 * Used in Sniper
 * Base on the Threshold (default to 10)
 * Convert 10.12345 to 10.12
 * Convert 9.123213 to 9.1234
 */
export function filterThresholdDecimal (val, threshold, decimal) {
  if(isNaN(val)) {
    return val;
  }
  threshold = threshold || 10;
  decimal = decimal || 2;

  if(val < threshold) {
    return parseFloat(angularFilters.number(val, 4));
  }
  return parseFloat(angularFilters.number(val, decimal));
}

export function filterDecimal (val, threshold, decimal) {
  if(isNaN(val)) {
    return val;
  }
  decimal = decimal || 2;
  return parseFloat(angularFilters.number(val, decimal));
}

/**
 * [filterFormatNumber description]
 * @param  {String|Number} val
 * @param  {Number} decimal [decimal places]
 * @param  {Boolean} noRound [if true, no rounding to the val]
 */
export function filterFormatNumber (val, decimal, noRound) {
  if(isNaN(val)) {
    return val;
  }
  if(decimal === undefined) {
    let stringVal = val.toString();
    let decimalIndex = stringVal.indexOf('.');
    if(decimalIndex > -1) {
      decimal = stringVal.length - 1 - decimalIndex;
      if(decimal === 3) {
        decimal = 4;
      }
    }
  }
  if(noRound) {
    let pow = Math.pow(10, decimal);
    if(val >= 0) {
      val = Math.floor(val * pow) / pow
    } else {
      val = Math.ceil(val * pow) / pow
    }

    return angularFilters.number(val, decimal);
  }
  return angularFilters.number(val, decimal)
}

export function filterFormatNonZero (val, decimal, noFixed) {
  if(0 == val) {
    return;
  }
  return filterFormatNumber.apply(null, arguments);
}

export function filterPercentage (val, decimal, withMark, filterOutNull) {
  if(isNaN(val)) {
    if(filterOutNull || val === undefined) {
      return;
    }
    return '0.000';
  }
  decimal = isNaN(decimal) ? 2 : decimal;
  let suffix = withMark ? '%' : '';
  return angularFilters.number(val * 100, decimal) + suffix;
}

export function filterNewCurrency (val, decimal) {
  decimal = decimal || 3;
  return angularFilters.currency(val, '$', decimal);
}

/**
 * Used in Sniper
 * Base on the Threshold (default to 10)
 * Convert 10.12345 to $10.12
 * Convert 9.123213 to $9.1234
 */
export function filterPriceThresholdDecimal (val, threshold, decimal) {
  if(!val) {
    return;
  }
  val = parseFloat(val.toString().replace(/[^0-9.]/g, ''));

  return '$' + filterThresholdDecimal(val, threshold, decimal);
}


export function filterPriceBaseOnKey (val, key, decimal) {
  if(/price/i.test(key) && !isNaN(val)) {
    return angularFilters.currency(val, '$', decimal);
  }
  return val;
}
