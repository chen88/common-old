export default class Sort {
  constructor () {}
  toggleOrder (key) {
    this.currentKey = key;
    this[key] = this[key] === '-' ? '+' : '-';
    this.currentOrder = this[key];
    this.arrangement = this[key] === '-' ? 'DESC' : 'ASC';
    return this.arrangement;
  }
  getClass (key) {
    if(this.currentKey !== key || typeof(this[key]) === 'undefined') {
      return;
    }
    return 'fa-arrow-' + (this[key] === '-' ? 'up' : 'down');
  }
}
