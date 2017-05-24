export function filterFormatDate (date, format, formatTo) {
  if(date) {
    if(format) {
      return moment(date, format).format(formatTo || 'MM/DD/YYYY');
    }
    return moment(date).format(formatTo || 'MM/DD/YYYY');
  }
  return date;
}

export function filterFormatDateTime (date, format, formatTo) {
  if(date) {
    if(format) {
      return moment(date, format).format(formatTo || 'MM/DD/YYYY hh:mm:ss a');
    }
    return moment(date).format(formatTo || 'MM/DD/YYYY hh:mm:ss a');
  }
  return date;
}

export function filterFormatUnixTime (date, format, formatTo) {
  if(date) {
    if(format) {
      return moment(date, format).format(formatTo || 'MM/DD/YYYY hh:mm:ss:SSS a');
    }
    return moment(date).format(formatTo || 'MM/DD/YYYY hh:mm:ss:SSS a');
  }
  return date;
}

export function filterFormatTime (date, format, millisec) {
  if(date) {
    let formatTo = millisec ? 'hh:mm:ss:SSS a' : 'hh:mm:ss a';
    if(format) {
      return moment(date, format).format(formatTo);
    }
    return moment(date).format(formatTo);
  }
  return date;
}

export function filterFormatNanoTime (date, nanoseconds, digit = 9) {
  if(date) {
    date = moment(date);
    let second = date.format('hh:mm:ss');
    nanoseconds = nanoseconds ? (':' + nanoseconds).substr(0, digit + 1) : '';
    let nanoFormat = `${second}${nanoseconds} ${date.format('a')}`;
    return nanoFormat;
  }
  return date;
}
