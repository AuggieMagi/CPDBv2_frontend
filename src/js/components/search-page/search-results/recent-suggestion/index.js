import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { noop } from 'lodash';

import './recent-suggestion.sass';
import SuggestionItem from 'components/search-page/search-results/suggestion-group/suggestion-item';
import { navigateToSearchItem } from 'utils/navigate-to-search-item';


export default class RecentSuggestion extends Component {
  handleClick = suggestion => {
    const { saveToRecent } = this.props;
    navigateToSearchItem(suggestion, (suggestion) => {
      saveToRecent({
        type: suggestion.type,
        id: suggestion.id,
        data: suggestion.recentItemData,
      });
    });
  };

  render() {
    const {
      recentSuggestions,
      addOrRemoveItemInPinboard,
      visitPinButtonIntroduction,
      saveToRecent,
      pinboardUrl,
      hide,
    } = this.props;
    return (
      <div
        className='recent-suggestions'>
        <div className='recent-header'>RECENT</div>
        <div>
          {
            recentSuggestions.map((suggestion) => (
              <SuggestionItem
                key={ suggestion.uniqueKey }
                suggestion={ suggestion }
                showPinButtonArea={ true }
                addOrRemoveItemInPinboard={ addOrRemoveItemInPinboard }
                visitPinButtonIntroduction={ visitPinButtonIntroduction }
                saveToRecent={ saveToRecent }
                clickItem={ this.handleClick }
                hide={ hide }
                pinboardUrl={ pinboardUrl }
              />
            ))
          }
        </div>
      </div>
    );
  }
}

RecentSuggestion.defaultProps = {
  recentSuggestions: [],
  addOrRemoveItemInPinboard: noop,
  saveToRecent: noop,
};

RecentSuggestion.propTypes = {
  recentSuggestions: PropTypes.array,
  addOrRemoveItemInPinboard: PropTypes.func,
  saveToRecent: PropTypes.func,
  pinboardUrl: PropTypes.string,
  visitPinButtonIntroduction: PropTypes.func,
  hide: PropTypes.bool,
};
