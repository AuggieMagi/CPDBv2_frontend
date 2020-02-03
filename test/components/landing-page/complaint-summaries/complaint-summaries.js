import React from 'react';
import { mountWithRouter } from 'utils/test';
import sinon from 'sinon';

import ComplaintSummaryCard from 'components/landing-page/complaint-summaries/complaint-summary-card';
import ComplaintSummaries from 'components/landing-page/complaint-summaries';
import { PINNED_ITEM_TYPES } from 'utils/constants';
import ItemPinButton from 'components/common/item-pin-button';
import pinButtonStyles from 'components/common/item-pin-button.sass';


describe('Complaint Summaries components', function () {
  const addOrRemoveItemInPinboard = sinon.stub();

  const data = [{
    'crid': '111',
    'categoryNames': ['Illegal Search'],
    'summary': 'This is summary 1',
    'incidentDate': new Date(2017, 6, 6),
    isPinned: true,
  }, {
    'crid': '112',
    'categoryNames': ['Use of Force'],
    'summary': 'This is summary 2',
    'incidentDate': new Date(2017, 1, 6),
    isPinned: false,
  }];

  it('should render appropriately', function () {
    const wrapper = mountWithRouter(
      <ComplaintSummaries
        cards={ data }
        addOrRemoveItemInPinboard={ addOrRemoveItemInPinboard }
      />
    );

    const complaintSummaryCards = wrapper.find(ComplaintSummaryCard);
    complaintSummaryCards.should.have.length(2);
    const complaintSummaryCard1 = complaintSummaryCards.at(0);
    complaintSummaryCard1.text().should.containEql('Illegal Search');
    complaintSummaryCard1.text().should.containEql('Jul 6, 2017');
    complaintSummaryCard1.text().should.containEql('This is summary 1');
    complaintSummaryCard1.find('.complaint-summary-card-summary-gradient').exists().should.be.true();

    const complaintSummaryCard2 = complaintSummaryCards.at(1);
    complaintSummaryCard2.text().should.containEql('Use of Force');
    complaintSummaryCard2.text().should.containEql('Feb 6, 2017');
    complaintSummaryCard2.text().should.containEql('This is summary 2');
    complaintSummaryCard2.find('.complaint-summary-card-summary-gradient').exists().should.be.true();

    complaintSummaryCards.forEach((card, index) => {
      const button = card.find(ItemPinButton);
      button.prop('className').should.equal(pinButtonStyles.cardPinnedButton);
      button.prop('addOrRemoveItemInPinboard').should.equal(addOrRemoveItemInPinboard);
      button.prop('showHint').should.be.false();
      button.prop('item').should.eql({
        type: PINNED_ITEM_TYPES.CR,
        id: data[index].crid,
        isPinned: data[index].isPinned,
      });
    });
  });
});
