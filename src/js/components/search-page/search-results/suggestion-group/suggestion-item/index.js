import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { get, isEqual, reduce } from 'lodash';

import withPinnableItem from './with-pinnable-item';
import { getOfficerSecondRowContent, getCRSecondRowContent } from './item-second-row';


export const OfficerItem = withPinnableItem(true, null, getOfficerSecondRowContent);
export const CRItem = withPinnableItem(true, null, getCRSecondRowContent);
export const TRRItem = withPinnableItem(true);
export const UnpinnableItem = withPinnableItem(false);

const COMPONENT_MAP = {
  OFFICER: OfficerItem,
  'DATE > OFFICERS': OfficerItem,
  'UNIT > OFFICERS': OfficerItem,
  CR: CRItem,
  'DATE > CR': CRItem,
  'INVESTIGATOR > CR': CRItem,
  'TRR': TRRItem,
  'DATE > TRR': TRRItem,
};

export default class SuggestionItem extends Component {
  shouldComponentUpdate(nextProps) {
    const keys = [
      'isFocused',
      'aliasEditModeOn',
      'suggestion',
      'hide',
    ];

    return reduce(keys, (memo, key) => (
      memo || !isEqual(get(nextProps, key), get(this.props, key))
    ), false);
  }

  render() {
    const { type } = this.props.suggestion;
    const ComponentType = get(COMPONENT_MAP, type, UnpinnableItem);
    return (
      <ComponentType { ...this.props }/>
    );
  }
}

SuggestionItem.propTypes = {
  suggestion: PropTypes.object,
  isFocused: PropTypes.bool,
  aliasEditModeOn: PropTypes.bool,
  selectItem: PropTypes.func,
  addOrRemoveItemInPinboard: PropTypes.func,
  saveToRecent: PropTypes.func,
  showIntroduction: PropTypes.bool,
  pinboardUrl: PropTypes.string,
  visitPinButtonIntroduction: PropTypes.func,
};

SuggestionItem.defaultProps = {
  suggestion: {},
  showIntroduction: false,
};
