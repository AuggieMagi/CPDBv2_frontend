import { handleActions } from 'redux-actions';
import { concat } from 'lodash';

import * as constants from 'utils/constants';

export default handleActions({
  [constants.FIRST_PAGE_GEOGRAPHIC_TRRS_PREVIEW_PANE_REQUEST_SUCCESS]: (state, action) => action.payload['results'],
  [constants.GEOGRAPHIC_TRRS_PREVIEW_PANE_REQUEST_SUCCESS]: (state, action) => concat(state, action.payload['results']),
}, []);
