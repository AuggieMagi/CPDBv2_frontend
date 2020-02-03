import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import CrawlersPage from 'components/crawlers-page';
import CrawlersTable from 'components/crawlers-page/crawlers-table';
import ShareableHeaderContainer from 'containers/headers/shareable-header/shareable-header-container';
import { SHAREABLE_HEADER_BUTTON_TYPE } from 'utils/constants';


describe('CrawlersPage component', function () {
  it('should render crawler page correctly', function () {
    const requestCrawlersStub = sinon.stub();
    const crawlers = [{
      id: 109,
      crawlerName: 'SUMMARY_REPORTS_COPA',
      numDocuments: 5,
      numNewDocuments: 1,
      recentRunAt: '2019-02-20',
    }, {
      id: 110,
      crawlerName: 'SUMMARY_REPORTS_COPA',
      numDocuments: 7,
      numNewDocuments: 2,
      recentRunAt: '2019-02-20',
    }, {
      id: 111,
      crawlerName: 'PORTAL_COPA',
      numDocuments: 15,
      numNewDocuments: 6,
      recentRunAt: '2019-02-20',
    }];
    const nextParams = { limit: '20', offset: '20' };

    const wrapper = shallow(
      <CrawlersPage
        crawlers={ crawlers }
        requestCrawlers={ requestCrawlersStub }
        nextParams={ nextParams }
      />
    );

    const shareableHeaderContainer = wrapper.find(ShareableHeaderContainer);
    shareableHeaderContainer.prop('buttonType').should.equal(SHAREABLE_HEADER_BUTTON_TYPE.LINK);
    shareableHeaderContainer.prop('buttonText').should.equal('Documents');
    shareableHeaderContainer.prop('to').should.equal('/documents/');

    const crawlersTable = wrapper.find(CrawlersTable);
    crawlersTable.prop('rows').should.eql(crawlers);
    crawlersTable.prop('nextParams').should.eql(nextParams);
    crawlersTable.prop('requestCrawlers').should.eql(requestCrawlersStub);
  });
});
