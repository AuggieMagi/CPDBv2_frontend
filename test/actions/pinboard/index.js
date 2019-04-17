import { createPinboard, updatePinboard, fetchPinboard, fetchPinboardSocialGraph } from 'actions/pinboard';
import * as constants from 'utils/constants';


describe('pinboard actions', function () {
  describe('createPinboard', function () {
    it('should return correct action', function () {
      createPinboard({ officerIds: [], crids: ['abc'], trrIds: [1] }).should.deepEqual({
        types: [
          constants.PINBOARD_CREATE_REQUEST_START,
          constants.PINBOARD_CREATE_REQUEST_SUCCESS,
          constants.PINBOARD_CREATE_REQUEST_FAILURE,
        ],
        payload: {
          request: {
            url: constants.PINBOARDS_URL,
            method: 'post',
            adapter: null,
            data: {
              'officer_ids': [],
              crids: ['abc'],
              'trr_ids': [1],
            }
          }
        }
      });
    });
  });

  describe('updatePinboard', function () {
    it('should return correct action', function () {
      const pinboard = {
        id: '1',
        title: 'Title',
        officerIds: ['1'],
        crids: [],
        trrIds: ['1'],
      };
      updatePinboard(pinboard).should.deepEqual({
        types: [
          constants.PINBOARD_UPDATE_REQUEST_START,
          constants.PINBOARD_UPDATE_REQUEST_SUCCESS,
          constants.PINBOARD_UPDATE_REQUEST_FAILURE,
        ],
        payload: {
          request: {
            url: `${constants.PINBOARDS_URL}1/`,
            method: 'put',
            adapter: null,
            data: {
              title: 'Title',
              'officer_ids': ['1'],
              crids: [],
              'trr_ids': ['1'],
            }
          }
        }
      });
    });
  });

  describe('fetchPinboard', function () {
    it('shoud return correct action', function () {
      fetchPinboard('1').should.deepEqual({
        types: [
          constants.PINBOARD_FETCH_REQUEST_START,
          constants.PINBOARD_FETCH_REQUEST_SUCCESS,
          constants.PINBOARD_FETCH_REQUEST_FAILURE,
        ],
        payload: {
          request: {
            url: `${constants.PINBOARDS_URL}1/`,
            params: undefined,
            adapter: null,
            cancelToken: undefined,
          }
        }
      });
    });
  });

  describe('fetchPinboardSocialGraph', function () {
    it('shoud return correct action', function () {
      fetchPinboardSocialGraph('1').should.deepEqual({
        types: [
          constants.PINBOARD_SOCIAL_GRAPH_FETCH_REQUEST_START,
          constants.PINBOARD_SOCIAL_GRAPH_FETCH_REQUEST_SUCCESS,
          constants.PINBOARD_SOCIAL_GRAPH_FETCH_REQUEST_FAILURE,
        ],
        payload: {
          request: {
            url: `${constants.PINBOARDS_URL}1/social-graph/`,
            params: undefined,
            adapter: null,
            cancelToken: undefined,
          }
        }
      });
    });
  });
});
