import editModeOn from 'reducers/pinboard-page/edit-mode-on';

import { PINBOARD_EDIT_TYPES, PINBOARD_EDIT_MODE, LOCATION_CHANGE } from 'utils/constants';


describe.only('summary reducer', function () {
  it('should have initial state', function () {
    editModeOn(undefined, {}).should.eql({
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: false,
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: false,
    });
  });

  it('should handle PINBOARD_EDIT_MODE', function () {
    editModeOn(
      {
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: false,
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: false,
      },
      {
        type: PINBOARD_EDIT_MODE,
        payload: { editType: PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION, mode: true }
      }
    ).should.eql( {
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: false,
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: true,
    });

    editModeOn(
      {
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: true,
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: true,
      },
      {
        type: PINBOARD_EDIT_MODE,
        payload: { editType: PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE, mode: false }
      }
    ).should.eql( {
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: false,
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: true,
    });
  });

  it('should handle LOCATION_CHANGE', function () {
    editModeOn(
      {
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: true,
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: true,
      },
      {
        type: LOCATION_CHANGE,
        payload: { pathname: '/pinboard/abcd1234/' }
      }
    ).should.eql({
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: false,
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: false,
    });

    editModeOn(
      {
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: true,
        [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: true,
      },
      {
        type: LOCATION_CHANGE,
        payload: { pathname: '/edit/pinboard/abcd1234/' }
      }
    ).should.eql({
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: true,
      [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: true,
    });
  });
});
