import { combineReducers } from 'redux';

import isRequesting from './is-requesting';
import sortDescending from './sort-descending';
import items from './items';
import minimap from './minimap';
import pagination from './pagination';

export default combineReducers({
  isRequesting,
  sortDescending,
  items,
  minimap,
  pagination
});
