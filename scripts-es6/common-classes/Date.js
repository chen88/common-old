/* Example Usage
select(
  ng-model="#{vm}.dateFilter.dateSelectionType"
  ng-options="date.value as date.name for date in #{vm}.dateFilter.dateSelection"
  ng-change="#{vm}.dateFilter.changeDateInterval()")

input.form-control(
            ng-model="#{vm}.dateFilter.from"
            uib-datepicker-popup
            datepicker-options="datepickerOptions"
            ng-model-options="dateNgModelOptions"
            is-open="#{vm}.dateFilter.popFrom"
            ng-click="#{vm}.dateFilter.popFrom = !#{vm}.dateFilter.popFrom"
            type="text"
            placeholder="From")
input.form-control(
            ng-model="#{vm}.dateFilter.to"
            uib-datepicker-popup
            datepicker-options="datepickerOptions"
            ng-model-options="dateNgModelOptions"
            is-open="#{vm}.dateFilter.popTo"
            ng-click="#{vm}.dateFilter.popTo = !#{vm}.dateFilter.popTo"
            type="text"
            placeholder="To")
*/
export default class DateInterval {
  constructor (nonExtend, nonRealTime) {
    this.nonExtend = nonExtend;
    this.nonRealTime = nonRealTime;
    this.realTime = !nonRealTime;
    this.reset();
  }
  reset () {
    if(this.nonRealTime) {
      this.dateSelectionType = 'lastDate';
      this.dateSelection = this.nonExtend ? tkgConst.dateSelection : tkgConst.extendedDateSelection;
    } else {
      this.dateSelectionType = 'today';
      this.dateSelection = this.nonExtend ? tkgConst.realtimeDateSelection : tkgConst.extendedRealtimeDateSelection;
    }
    this.from;
    this.to;
    this.changeDateInterval();
  }
  disableWeekend () {
    return tkgConst.disableWeekend.apply(null, arguments);
  }
  /**
   * @param {String} dateSelectionType - none, lastDate...
   */
  changeDateInterval (dateSelectionType) {
    this.dateSelectionType = dateSelectionType = dateSelectionType || this.dateSelectionType;
    this.dateSelectionName = _.get(_.find(this.dateSelection, {value: dateSelectionType}), 'name');
    let dateRange = tkgConst.getDateRange[dateSelectionType](this.realTime);
    if(!dateRange) {
      return;
    }
    this.from = dateRange.from;
    this.to = dateRange.to;
  }
  momentize () {
    let formattedFrom = this.from.toLocaleDateString ?  moment(this.from.toLocaleDateString(), 'MM/DD/YYYY') : moment(this.from);
    let formattedTo = this.to.toLocaleDateString ?  moment(this.to.toLocaleDateString(), 'MM/DD/YYYY') : moment(this.to);
    this.momentFrom = formattedFrom;
    this.momentTo = formattedTo;
    this.formattedFrom = formattedFrom.startOf('day').toISOString();
    this.formattedTo = formattedTo.endOf('day').toISOString();
  }
  clear () {
    this.dateSelectionType = 'none';
    this.dateSelectionName = '';
    this.from = this.to = this.momentFrom = this.momentTo = this.formattedFrom = this.formattedTo = undefined;
  }
  changeDate () {
    this.dateSelectionType = 'none';
    this.dateSelectionName = '';
  }
}

export class DateBack {
  constructor () {
    this.dateSelectionType = null;
    this.dateSelection = tkgConst.dateBackSelection;
    this.momentize();

    this.minTime = 9;
    this.maxTime = 17;
    this.minuteStep = 15;
    let nearestQuarter = (parseInt((moment().minutes() + 15)/15) * 15) % 60;
    this.time = moment().minutes(nearestQuarter).toDate();
  }
  momentize () {
    if(this.dateSelectionType ===  null) {
      this.formattedDate = moment().toISOString();
      return;
    }
    let date = moment().subtractWeekDays(this.dateSelectionType, 'day').startOf('day');
    let time = this.time || new Date(); // Date object not moment object
    if(time && typeof(time.getHours) === 'function') {
      let hours = time.getHours();
      let minutes = time.getMinutes();
      date.hours(hours).minutes(minutes);
      this.formattedDate = date.toISOString();
    } else {
      this.formattedDate = date.toISOString();
    }

  }
}
