export function filterShortHand (val) {
  if(typeof(val) !== 'string') {
    return;
  }
  let strArr = val.split(' ');
  if(strArr.length > 1) {
    return _.map(strArr, (str) => { return _.head(str); }).join('');
  } else {
    return val;
  }
}

/**
 * Convert 'exampleTesting' to 'Example Testing'
 */
export function filterCamelCase (val) {
  if(typeof(val) !== 'string') {
    return;
  }
  let newStr = '';
  _.forEach(val, (c) => {
    if(/[A-Z]/.test(c)) {
      c = ' ' + c;
    }
    newStr += c;
  });
  newStr = _.upperFirst(newStr);

  return newStr;
}

/**
 * Convert 'exampleTesting' to 'Example Testing'
 * Convert 'example_testing' to 'Example Testing'
 * Convert non-digit, letters to space
 */
export function filterCamelSplitString (val) {
  if(typeof(val) !== 'string') {
    return;
  }
  let newStr = '';
  let camel = false;
  _.forEach(val, (c) => {
    if(camel || /[A-Z]/.test(c)) {
      newStr += ' ' + c.toUpperCase();
      camel = false;
    } else if(!/[a-z\d]/.test(c)) {
      camel = true;
    } else {
      newStr += c;
    }
  });
  newStr = _.upperFirst(newStr);

  return newStr;
}

/**
 * Convert 'test_subject' to 'test subject'
 */
export function filterSplitString (val) {
  if(typeof(val) !== 'string') {
    return;
  }
  return val.replace(/[-_]/g, ' ');
}

export function filterTradeType (val) {
  let type = '';
  switch(val) {
    case 'B':
    case 'P':
      type = 'Buy';
      break;
    case 'S':
      type = 'Sell';
      break;
    case 'D':
      type = 'Dealer';
      break;
    default:
      type = val;
  }
  return type;
}

export function filterComparator (val) {
  switch(val) {
    case 'lt':
      val = '<';
      break;
    case 'gt':
      val = '>';
      break;
    case 'lte':
      val = '<=';
      break;
    case 'gte':
      val = '>=';
      break;
    case 'eq':
      val = '=';
      break;
  }
  return val;
}

/**
 * Sentinel
 */
export function filterRating (rating, corpOrMuni) {
  if(typeof(rating) === 'undefined') return null;
  let convertedRating;
  if (/MUNI/.test(corpOrMuni)) {
    switch (rating) {
      case 1:
        convertedRating = 'Low';
        break;
      case 2:
        convertedRating = 'Medium';
        break;
      case 3:
        convertedRating = 'High';
        break;
      case 4:
        convertedRating = 'Not Rated / Other';
        break;
      default:
        convertedRating = 'Not Rated / Other';
    }
  } else { //Corp
    switch (rating) {
      case 1:
        convertedRating = 'Prime';
        break;
      case 2:
        convertedRating = 'High';
        break;
      case 3:
        convertedRating = 'Upper Medium';
        break;
      case 4:
        convertedRating = 'Lower Medium';
        break;
      case 5:
        convertedRating = 'Non Investment';
        break;
      case 6:
        convertedRating = 'Highly Speculative or Lower';
        break;
      default:
        convertedRating = 'Highly Speculative or Lower';
    }
  }
  return convertedRating;
}

/**
 * Sentinel
 */
export function filterExceptionStatus (status) {
  let convertedStatus;
  switch (status) {
    case 0:
      convertedStatus = 'Not Processed';
      break;
    case 1:
      convertedStatus = 'Excluded';
      break;
    case 2:
      convertedStatus = 'Insufficient Data';
      break;
    case 1000:
      convertedStatus = 'Passed';
      break;
    case 3000:
      convertedStatus = 'Alert';
      break;
    case 4000:
      convertedStatus = 'Exception';
      break;
    default:
      convertedStatus = 'Passed';
  }
  return convertedStatus;
}

/**
 * Sentinel
 */
export function filterFixedIncomeCategory (category) {
  let convertedCategory;
  switch (category) {
    case 'all':
      convertedCategory = 'Total';
      break;
    case 'exception':
      convertedCategory = 'Exception';
      break;
    case 'pendingreview':
      convertedCategory = 'Pending Rev';
      break;
    case 'review':
      convertedCategory = 'Reviewed';
      break;
    case 'pendingApproval':
      convertedCategory = 'Pending Appr';
      break;
    case 'approved':
      convertedCategory = 'Approved';
      break;
    case 'alert':
      convertedCategory = 'Alert';
      break;
    default:
      convertedCategory = filterCamelCase(category);
  }
  return convertedCategory;
}

/**
 * Scout
 */
export function filterQuoteStatus (status, quoteType) {
  if(typeof(status) !== 'string') {
    return;
  }

  quoteType = /offer/i.test(quoteType) ? 'Offer' : 'Bid';

  let convertedStatus;

  switch(status) {
    case 'QUOTE_REQUEST_RECEIVED':
      convertedStatus = 'Received';
      break;
    case 'QUOTE_PENDING':
      convertedStatus = 'Pending';
      break;
    case 'QUOTE_REQUEST_REJECTED_BY_STRATEGIES':
      convertedStatus = 'No Bid';
      break;
    case 'QUOTE_SENT':
      convertedStatus = 'Submitted';
      break;
    case 'QUOTE_REJECTED':
      convertedStatus = 'Q. Rejected';
      break;
    case 'QUOTE_RESPONSE_RECEIVED':
      convertedStatus = 'Q. Responded';
      break;
    case 'USER_CANCELED_SEND':
      convertedStatus = 'Not Submitted';
      break;
    case 'USER_CANCELED_SENT_QUOTE':
      convertedStatus = 'Canceled';
      break;
    case 'BIDDING_DISABLED':
      convertedStatus = 'Disabled';
      break;
    case 'STATUS_REPORT_RECEIVED':
      convertedStatus = 'Closed';
      break;
    case 'EXECUTION_REPORT_SENT':
      convertedStatus = 'Execution Report Sent';
      break;
    default:
      convertedStatus = filterCamelSplitString(status.toLowerCase());
  }
  return convertedStatus;
}

export function filterBoolean (flag) {
  if(flag) {
    return 'Y';
  }
  return 'N';
}

/**
 * Scout
 */
export function filterQuoteBidStatus  (status, notNull) {
  if(typeof(status) !== 'string') {
    return;
  }
  let convertedStatus = '';
  switch(status) {
    case 'HIT_LIFT':
      convertedStatus = 'Hit';
      break;
    case 'NO_STATUS':
      if(notNull) {
        convertedStatus = filterCamelSplitString(status.toLowerCase());
      }
      break;
    default:
      convertedStatus = filterCamelSplitString(status.toLowerCase());
  }
  return convertedStatus;
}

export function filterAcceptedRejected (status) {
  return status ? 'Accepted' : 'Rejected';
}
