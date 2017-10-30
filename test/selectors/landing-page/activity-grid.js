import { cardsSelector } from 'selectors/landing-page/activity-grid';
import { RawOfficerCardFactory } from 'utils/test/factories/activity-grid.js';
import lodash from 'lodash';
import { spy } from 'sinon';

describe('activity-grid selectors', function () {
  let state;

  beforeEach(function () {
    state = {
      landingPage: {
        activityGrid: {}
      }
    };
  });

  describe('cardsSelector', function () {
    it('should return a list of cards', function () {
      state.landingPage.activityGrid.cards = RawOfficerCardFactory.buildList(40);
      cardsSelector(state).should.have.length(40);
    });

    it('should transform correctly', function () {
      state.landingPage.activityGrid.cards = [{
        id: '1', 'full_name': 'someone', 'visual_token_background_color': 'red'
      }];
      cardsSelector(state).should.eql([{
        id: '1', fullName: 'someone', visualTokenBackgroundColor: 'red'
      }]);
    });

    it('should shuffle cards', function () {
      const stubShuffle = spy(lodash, 'shuffle');
      state.landingPage.activityGrid.cards = lodash.range(40);

      cardsSelector(state);

      stubShuffle.calledWith(lodash.range(0, 12)).should.be.true();
      stubShuffle.calledWith(lodash.range(12, 40)).should.be.true();

      stubShuffle.restore();
    });

  });
});