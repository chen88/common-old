// let injector = angular.injector(['ng']);

// setTimeout(() => {
//   _.assign(injector, $('html').injector());
// }, 1000);

let $filter = injector.get('$filter');

let filterNames = [
  'currency',
  'date',
  'filter',
  'json',
  'limitTo',
  'lowercase',
  'number',
  'orderBy',
  'uppercase'
];

let angularFilters = {
  $filter: $filter
};

_.forEach(filterNames, (filterName) => {
  angularFilters[filterName] = injector.get(`${filterName}Filter`);
});

export default angularFilters;
export {injector};
