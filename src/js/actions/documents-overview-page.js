import { CancelToken } from 'axios';

import * as constants from 'utils/constants';
import { get, authenticatedGet } from 'actions/common/async-action';


let source;

const cancelOldRequest = (newRequest) => (...args) => {
  if (source) {
    source.cancel('Cancelled by user');
  }
  source = CancelToken.source();
  return newRequest(...args);
};

export const fetchDocuments = cancelOldRequest(
  params => get(
    constants.DOCUMENTS_URL,
    [
      constants.DOCUMENT_OVERVIEW_REQUEST_START,
      constants.DOCUMENT_OVERVIEW_REQUEST_SUCCESS,
      constants.DOCUMENT_OVERVIEW_REQUEST_FAILURE,
    ],
    source.token
  )({ ...params })
);

export const fetchDocumentsAuthenticated = cancelOldRequest(
  params => authenticatedGet(
    constants.DOCUMENTS_URL,
    [
      constants.DOCUMENT_OVERVIEW_REQUEST_START,
      constants.DOCUMENT_OVERVIEW_REQUEST_SUCCESS,
      constants.DOCUMENT_OVERVIEW_REQUEST_FAILURE,
    ],
    source.token
  )({ ...params, authenticated: true })
);

