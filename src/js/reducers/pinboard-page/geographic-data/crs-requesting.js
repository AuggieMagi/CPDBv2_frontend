import createRequestingReducer from 'reducers/common/requesting';
import {
  FIRST_PAGE_PINBOARD_GEOGRAPHIC_CRS_FETCH_REQUEST_START,
  FIRST_PAGE_PINBOARD_GEOGRAPHIC_CRS_FETCH_REQUEST_SUCCESS,
  FIRST_PAGE_PINBOARD_GEOGRAPHIC_CRS_FETCH_REQUEST_FAILURE,
} from 'utils/constants';

export default createRequestingReducer(
  FIRST_PAGE_PINBOARD_GEOGRAPHIC_CRS_FETCH_REQUEST_START,
  FIRST_PAGE_PINBOARD_GEOGRAPHIC_CRS_FETCH_REQUEST_SUCCESS,
  FIRST_PAGE_PINBOARD_GEOGRAPHIC_CRS_FETCH_REQUEST_FAILURE,
);
