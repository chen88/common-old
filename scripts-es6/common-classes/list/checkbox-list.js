export class CheckboxList {
  /**
   * [constructor description]
   * @param  {Array} list [Array of strings, or object {name: '', value: '', isChecked: false}]
   */
  constructor (list) {
    list = _.cloneDeep(list);
    if(list && list.length && typeof(list[0]) !== 'object') {
      _.forEach(list, (value, i) => {
        list[i] = {
          name: value,
          value: value,
          isChecked: true,
        };
      });
    }
    this.list = list || [];
    this.selectedList = _.filter(list, {isChecked: true});
  }
  add (value, ext, isChecked) {
    if(!value) {
      return;
    }
    let option = this.find(value);
    if(option) {
      return option;
    }
    option = {
      name: value,
      value: value,
      isChecked: typeof(isChecked) === 'boolean' ? isChecked : true
    };
    _.assign(option, ext);

    this.list.push(option);
    if(option.isChecked) {
      this.selectedList.push(option);
    }
    return option;
  }
  remove (value) {
    _.remove(this.list, {value: value});
    _.remove(this.selectedList, {value: value});
  }
  removeAll () {
    this.list.length = 0;
    this.selectedList.length = 0;
  }
  select (option) {
    option.isChecked = !option.isChecked;
    this.triggerSelection(option);
  }
  triggerSelection (option) {
    if(option.isChecked) {
      this.addSelection(option);
    } else {
      this.removeSelection(option);
    }
    if(!option.value && option.isChecked) {
      this.deselectNonNull(option);
    } else {
      this.deselectNull(option);
    }
  }
  addSelection (option) {
    if(!option) {
      return;
    }
    option.isChecked = true;
    if(!_.find(this.selectedList, {value: option.value, name: option.name})) {
      this.selectedList.push(option);
    }
  }
  removeSelection (option) {
    option.isChecked = false;
    _.remove(this.selectedList, {value: option.value, name: option.name});
  }
  getCheckedList () {
    let list = _.clone(this.selectedList);
    _.remove(list, {ignored: true});
    return list;
  }
  getCheckedListValue () {
    let list = this.getCheckedList();
    let checkedList = _.map(list, 'value');
    _.pull(checkedList, null);
    return checkedList;
  }
  getCheckedListName () {
    let list = this.getCheckedList();
    let checkedList = _.map(list, 'name');
    _.pull(checkedList, null);
    return checkedList;
  }
  getListValue () {
    return _.map(this.list, 'value');
  }
  selectAll () {
    _.forEach(this.list, (option) => {
      option.isChecked = true;
      this.triggerSelection(option);
    });
    let option = this.find(null);
    if(option) {
      option.isChecked = false;
    }
  }
  hasAllSelected () {
    return _.every(this.list, {isChecked: true});
  }
  deselectAll () {
    _.forEach(this.list, (option) => {
      this.removeSelection(option);
      option.isChecked = false;
    });
  }
  deselectNonNull () {
    let option = this.find(null);
    this.deselectAll();
    if(option) {
      option.isChecked = true;
    }
  }
  deselectNull (option) {
    let nullOption = this.find(null);
    if(_.every(this.list, {isChecked: false}) && nullOption) {
      nullOption.isChecked = true;
    } else if(nullOption) {
      nullOption.isChecked = false;
    }
  }
  has (value) {
    return _.some(this.selectedList, {value: value});
  }
  find (value) {
    return _.find(this.list, {value: value});
  }
  getExpandClass () {
    if(!this.selectedList.length) {
      return 'hide';
    }
    let count =  this.selectedList.length > 5 ? 5 : this.selectedList.length;
    return `expand expand-${count}`;
  }
  getCompressedClass () {
    let count =  this.selectedList.length > 5 ? 5 : this.selectedList.length;
    return `compressed-${count}`;
  }
  getNames () {
    return _.map(this.selectedList, 'name');
  }
  getStringName () {
    return _.map(this.selectedList, 'name').join(', ');
  }
}
