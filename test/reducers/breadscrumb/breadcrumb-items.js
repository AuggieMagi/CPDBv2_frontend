import { LOCATION_CHANGE } from 'connected-react-router';

import breadcrumbItems from 'reducers/breadcrumb/breadcrumb-items';
import { UPDATE_PATH_NAME } from 'utils/constants';


describe('breadcrumbItems', function () {
  it('should return initial state', function () {
    breadcrumbItems(undefined, {}).should.eql([]);
  });

  describe('handle LOCATION_CHANGE', function () {
    it('should add pathname', function () {
      breadcrumbItems(['/search/'], {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/officer/123/',
          },
        },
      }).should.eql(['/search/', '/officer/123/']);
    });

    it('should reset bredscrumb when visit /', function () {
      breadcrumbItems(['/search/'], {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
          },
        },
      }).should.eql([]);
    });

    it('should remove the rest items when move back to visited item', function () {
      breadcrumbItems(['/officer/123/', '/search/', '/trr/1/'], {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/search/',
          },
        },
      }).should.eql(['/officer/123/', '/search/']);
    });

    it('should remove the rest items when move back to visited item with the same key', function () {
      breadcrumbItems(['/search/', '/officer/123/edward-may/', '/trr/1/'], {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/officer/123/edward-may/map/',
          },
        },
      }).should.eql(['/search/', '/officer/123/edward-may/map/']);
    });

    it('should handle edit path', function () {
      breadcrumbItems(['/search/', '/officer/123/'], {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/edit/officer/123/',
          },
        },
      }).should.eql(['/search/', '/officer/123/']);
    });

    it('should handle empty pathname', function () {
      breadcrumbItems(['/search/'], {
        type: LOCATION_CHANGE,
        payload: {},
      }).should.eql(['/search/']);
    });
  });

  describe('handle UPDATE_PATH_NAME', function () {
    it('should replace last visited item', function () {
      breadcrumbItems(['/search/', '/officer/123/old-name/'], {
        type: UPDATE_PATH_NAME,
        payload: '/officer/123/new-name/',
      }).should.eql(['/search/', '/officer/123/new-name/']);
    });
  });
});
