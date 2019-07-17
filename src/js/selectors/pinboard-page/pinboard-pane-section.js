import { isEmpty, isNull } from 'lodash';
import { createSelector } from 'reselect';

import { geographicDataRequestingSelector, hasMapMarkersSelector } from './geographic-data';
import { getSocialGraphRequesting, getCoaccusedData } from './social-graph';
import { PINBOARD_PAGE_TAB_NAMES } from 'utils/constants';


export const pinboardPaneSectionRequestingSelector = createSelector(
  getSocialGraphRequesting,
  geographicDataRequestingSelector,
  (socialGraphRequesting, geographicDataRequesting) => socialGraphRequesting || geographicDataRequesting
);

export const defaultTabSelector = createSelector(
  pinboardPaneSectionRequestingSelector,
  getCoaccusedData,
  hasMapMarkersSelector,
  (pinboardPaneSectionRequesting, coaccusedData, hasMapMarkers) => {
    if (!pinboardPaneSectionRequesting) {
      if (isEmpty(coaccusedData) && hasMapMarkers) {
        return PINBOARD_PAGE_TAB_NAMES.GEOGRAPHIC;
      } else {
        return PINBOARD_PAGE_TAB_NAMES.NETWORK;
      }
    } else {
      return null;
    }
  }
);

export const getCurrentTab = (state) => {
  const currentTab = state.pinboardPage.currentTab;
  if (isNull(currentTab)) {
    return defaultTabSelector(state);
  } else {
    if (currentTab === PINBOARD_PAGE_TAB_NAMES.GEOGRAPHIC && !hasMapMarkersSelector(state)) {
      return PINBOARD_PAGE_TAB_NAMES.NETWORK;
    }
    return currentTab;
  }
};
