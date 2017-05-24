'use strict';

export default class Paging {
  constructor (maxResult) {
    this.maxResult = maxResult || 50;
    this.currentPage = 1;
    this.totalResult = 0;
    this.pages = 1;
  }
  reset () {
    this.currentPage = 1;
    this.totalResult = 0;
    this.pages = 1;
  }
}
