import should from 'should';
import { LOCATION_CHANGE } from 'connected-react-router';

import crItemsReducer from 'reducers/pinboard-page/cr-items/items';
import * as constants from 'utils/constants';


describe('crItemsReducer', function () {
  it('should have initial state', function () {
    should(crItemsReducer(undefined, {})).eql([]);
  });

  it('should handle PINBOARD_COMPLAINTS_FETCH_REQUEST_SUCCESS', function () {
    crItemsReducer(
      [{ 'crid': '1' }],
      {
        type: constants.PINBOARD_COMPLAINTS_FETCH_REQUEST_SUCCESS,
        payload: [
          { 'crid': '2' }, { 'crid': '3' },
        ],
      }
    ).should.deepEqual([{ 'crid': '2' }, { 'crid': '3' }]);
  });

  it('should handle ADD_ITEM_IN_PINBOARD_PAGE with payload.type is CR', function () {
    crItemsReducer(
      [{ 'crid': '1' }],
      {
        type: constants.ADD_ITEM_IN_PINBOARD_PAGE,
        payload: {
          type: 'CR',
          id: '2',
          rawData: {
            'crid': '2',
            'incident_date': 'Apr 4, 2017',
            'most_common_category': 'Use Of Force',
            'point': { 'lon': 1.0, 'lat': 2.0 },
          },
        },
      }
    ).should.deepEqual([{
      'crid': '1',
    }, {
      'crid': '2',
      'incident_date': 'Apr 4, 2017',
      'most_common_category': 'Use Of Force',
      'point': { 'lon': 1.0, 'lat': 2.0 },
    }]);
  });

  it('should handle ADD_ITEM_IN_PINBOARD_PAGE with duplicated crid', function () {
    crItemsReducer(
      [{ 'crid': '1' }],
      {
        type: constants.ADD_ITEM_IN_PINBOARD_PAGE,
        payload: {
          type: 'CR',
          id: '1',
          rawData: {
            'crid': '1',
            'incident_date': 'Apr 4, 2017',
            'most_common_category': 'Use Of Force',
            'point': { 'lon': 1.0, 'lat': 2.0 },
          },
        },
      }
    ).should.deepEqual([{ 'crid': '1' }]);
  });

  it('should handle ADD_ITEM_IN_PINBOARD_PAGE and do nothing if type is not CR', function () {
    crItemsReducer(
      [{ 'crid': '1' }],
      {
        type: constants.ADD_ITEM_IN_PINBOARD_PAGE,
        payload: {
          type: 'OFFICER',
          id: '2',
          rawData: {
            'id': 2,
            'full_name': 'Jerome Finnigan',
            'rank': 'Officer',
            'complaint_count': 3,
            'percentile': null,
          },
        },
      }
    ).should.deepEqual([{ 'crid': '1' }]);
  });

  it('should handle COMPLETE_REMOVE_ITEM_FROM_PINBOARD with payload.type is CR', function () {
    crItemsReducer(
      [{
        'crid': '1',
      }, {
        'crid': '2',
        'incident_date': 'Apr 4, 2017',
        'most_common_category': 'Use Of Force',
        'point': { 'lon': 1.0, 'lat': 2.0 },
      }, {
        'crid': '3',
      }],
      {
        type: constants.COMPLETE_REMOVE_ITEM_FROM_PINBOARD,
        payload: {
          type: 'CR',
          id: '2',
        },
      }
    ).should.deepEqual([{ 'crid': '1' }, { 'crid': '3' }]);
  });

  it('should handle COMPLETE_REMOVE_ITEM_FROM_PINBOARD with payload.type is not CR', function () {
    crItemsReducer(
      [{
        'crid': '1',
      }, {
        'crid': '2',
      }, {
        'crid': '3',
      }],
      {
        type: constants.COMPLETE_REMOVE_ITEM_FROM_PINBOARD,
        payload: {
          type: 'TRR',
          id: '2',
        },
      }
    ).should.deepEqual([{ 'crid': '1' }, { 'crid': '2' }, { 'crid': '3' }]);
  });

  it('should handle ORDER_PINBOARD', function () {
    crItemsReducer(
      [{
        'crid': '1',
      }, {
        'crid': '2',
        'incident_date': 'Apr 4, 2017',
        'most_common_category': 'Use Of Force',
        'point': { 'lon': 1.0, 'lat': 2.0 },
      }],
      {
        type: constants.ORDER_PINBOARD,
        payload: {
          type: 'CR',
          ids: ['2', '1', '3'],
        },
      }
    ).should.deepEqual([{
      'crid': '2',
      'incident_date': 'Apr 4, 2017',
      'most_common_category': 'Use Of Force',
      'point': { 'lon': 1.0, 'lat': 2.0 },
    }, {
      'crid': '1',
    }]);
  });

  it('should handle ORDER_PINBOARD and do nothing if type is not CR', function () {
    crItemsReducer(
      [{
        'crid': '1',
      }, {
        'crid': '2',
        'incident_date': 'Apr 4, 2017',
        'most_common_category': 'Use Of Force',
        'point': { 'lon': 1.0, 'lat': 2.0 },
      }],
      {
        type: constants.ORDER_PINBOARD,
        payload: {
          type: 'OFFICER',
          ids: ['2', '1'],
        },
      }
    ).should.deepEqual([{
      'crid': '1',
    }, {
      'crid': '2',
      'incident_date': 'Apr 4, 2017',
      'most_common_category': 'Use Of Force',
      'point': { 'lon': 1.0, 'lat': 2.0 },
    }]);
  });

  it('should handle LOCATION_CHANGE', function () {
    crItemsReducer(
      [{ 'crid': '1' }],
      {
        type: LOCATION_CHANGE,
        payload: [
          { 'crid': '2' }, { 'crid': '3' },
        ],
      }
    ).should.deepEqual([]);
  });
});
