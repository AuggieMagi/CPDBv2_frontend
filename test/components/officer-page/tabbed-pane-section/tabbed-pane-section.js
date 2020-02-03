import React from 'react';
import { shallow, mount } from 'enzyme';
import MockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { OFFICER_PAGE_TAB_NAMES } from 'utils/constants';
import TabbedPaneSection from 'components/officer-page/tabbed-pane-section';
import Timeline from 'components/officer-page/tabbed-pane-section/timeline';
import AllegationsMap from 'components/common/allegations-map';
import Coaccusals from 'components/officer-page/tabbed-pane-section/coaccusals';
import AttachmentsTab from 'components/officer-page/tabbed-pane-section/attachments-tab';


describe('TabbedPaneSection component', function () {
  const mockStore = MockStore();
  const store = mockStore({
    officerPage: {
      newTimeline: {},
      coaccusals: [],
    },
    popups: [],
    pinboardPage: { pinboard: null },
  });

  it('should render Header with correct tab names with correct order', function () {
    const wrapper = shallow(
      <TabbedPaneSection
        currentTab='TIMELINE'
        hasComplaint={ true }
        hasMapMarker={ true }
        hasCoaccusal={ true }
      />
    );

    const tabNames = wrapper.find('.tabbed-pane-tab-name');

    tabNames.should.have.length(4);
    tabNames.at(0).text().should.equal('TIMELINE');
    tabNames.at(1).text().should.equal('MAP');
    tabNames.at(2).text().should.equal('COACCUSALS');
    tabNames.at(3).text().should.equal('DOCUMENTS');
  });

  it('should hide the tabs with no data', function () {
    const wrapper = shallow(
      <Provider store={ store }>
        <TabbedPaneSection
          currentTab='TIMELINE'
          hasComplaint={ false }
          hasMapMarker={ false }
          hasCoaccusal={ false }
        />
      </Provider>
    ).find(TabbedPaneSection).dive();

    const tabNames = wrapper.find('.tabbed-pane-tab-name');

    tabNames.should.have.length(1);
    tabNames.at(0).text().should.equal('TIMELINE');
  });

  it('should render timeline tab', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <TabbedPaneSection currentTab={ OFFICER_PAGE_TAB_NAMES.TIMELINE }/>
      </Provider>
    );

    wrapper.find(Timeline).exists().should.be.true();
  });

  it('should render map tab', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <TabbedPaneSection currentTab={ OFFICER_PAGE_TAB_NAMES.MAP }/>
      </Provider>
    );

    wrapper.find(AllegationsMap).exists().should.be.true();
  });

  it('should render coaccusals tab', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <TabbedPaneSection currentTab={ OFFICER_PAGE_TAB_NAMES.COACCUSALS }/>
      </Provider>
    );

    wrapper.find(Coaccusals).exists().should.be.true();
  });

  it('should render attachment tab', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <TabbedPaneSection currentTab={ OFFICER_PAGE_TAB_NAMES.ATTACHMENTS }/>
      </Provider>
    );

    wrapper.find(AttachmentsTab).exists().should.be.true();
  });

  it('should call changeOfficerTab when clicking tab name', function () {
    const stubChangeOfficerTab = sinon.stub();
    const wrapper = shallow(
      <Provider store={ store }>
        <TabbedPaneSection
          changeOfficerTab={ stubChangeOfficerTab }
          hasCoaccusal={ true }
          hasComplaint={ true }
          hasMapMarker={ true }
        />
      </Provider>
    ).find(TabbedPaneSection).dive();

    const mapTab = wrapper.find('.tabbed-pane-tab-name').at(1);
    mapTab.simulate('click');

    stubChangeOfficerTab.should.be.calledWith('MAP');
  });
});
