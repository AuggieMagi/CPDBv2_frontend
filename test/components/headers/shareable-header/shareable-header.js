import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import MockStore from 'redux-mock-store';
import Breadcrumbs from 'redux-breadcrumb-trail';
import { stub } from 'sinon';
import * as domUtils from 'utils/dom';

import ShareableHeader from 'components/headers/shareable-header';
import HeaderButton from 'components/headers/shareable-header/header-button';
import ShareableHeaderContainer from 'containers/headers/shareable-header/shareable-header-container';
import LinkHeaderButton from 'components/headers/shareable-header/link-header-button';
import * as constants from 'utils/constants';
import { SHAREABLE_HEADER_BUTTON_TYPE } from 'utils/constants';
import { updateShareablePageScrollPosition } from 'actions/headers/shareable-header';


describe('ShareableHeader component', function () {
  class CustomMenu extends React.Component {
    render() {
      return <div/>;
    }
  }

  let wrapper, shareableHeader;

  beforeEach (function () {
    this.stubOnOpen = stub();
    this.stubOnClose = stub();
    wrapper = shallow(
      <ShareableHeader
        buttonType={ SHAREABLE_HEADER_BUTTON_TYPE.MENU }
        Menu={ CustomMenu }
        onOpen={ this.stubOnOpen }
        onClose={ this.stubOnClose }
        updateShareablePageScrollPosition={ updateShareablePageScrollPosition }
      />
    );
    shareableHeader = wrapper;
  });

  it('should render HeaderButton, breadCrumbs and other contents', function () {
    const headerButton = wrapper.find(HeaderButton);
    headerButton.prop('Menu').should.eql(CustomMenu);
    headerButton.prop('onOpen').should.eql(this.stubOnOpen);
    headerButton.prop('onClose').should.eql(this.stubOnClose);

    const breadcrumbs = wrapper.find(Breadcrumbs);
    breadcrumbs.prop('className').should.equal('breadcrumbs');

    wrapper.find('.shareable-header-header-placeholder').exists().should.be.true();
    wrapper.find('.shareable-header-nav-bar').exists().should.be.true();
  });

  describe('handleScroll', function () {
    beforeEach(function () {
      stub(domUtils, 'calculatePosition');
    });

    afterEach(function () {
      domUtils.calculatePosition.restore();
    });

    it('should remain in top position', function () {
      domUtils.calculatePosition.returns('top');
      shareableHeader.instance().handleScroll();
      shareableHeader.state('position').should.equal('top');
    });

    it('should transition to middle position', function () {
      domUtils.calculatePosition.returns('middle');
      shareableHeader.instance().handleScroll();
      shareableHeader.state('position').should.equal('middle');
    });

    it('should transition to bottom position', function () {
      domUtils.calculatePosition.returns('bottom');
      shareableHeader.instance().handleScroll();
      shareableHeader.state('position').should.equal('bottom');
    });
  });
});

describe('ShareableHeader component with button components', function () {
  it('should render LinkHeaderButton component if buttonType is LINK', function () {
    const wrapper = shallow(
      <ShareableHeader buttonType={ constants.SHAREABLE_HEADER_BUTTON_TYPE.LINK }/>
    );
    wrapper.find(LinkHeaderButton).exists().should.be.true();
  });

  it('should render HeaderButton component if buttonType is MENU', function () {
    const wrapper = shallow(
      <ShareableHeader buttonType={ constants.SHAREABLE_HEADER_BUTTON_TYPE.MENU }/>
    );
    wrapper.find(HeaderButton).exists().should.be.true();
  });

  it('should not render button if buttonType is NONE', function () {
    const wrapper = shallow(
      <ShareableHeader buttonType={ constants.SHAREABLE_HEADER_BUTTON_TYPE.NONE }/>
    );

    wrapper.find(LinkHeaderButton).exists().should.be.false();
    wrapper.find(HeaderButton).exists().should.be.false();
  });
});

describe('ShareableHeader global click listener', function () {
  const mockStore = MockStore();
  const store = mockStore({
    breadcrumb: {
      breadcrumbs: [],
    },
  });

  let wrapper, shareableHeader;

  beforeEach(function () {
    stub(document.body, 'addEventListener');
    stub(document.body, 'removeEventListener');
    wrapper = mount(
      <Provider store={ store }>
        <ShareableHeaderContainer />
      </Provider>
    );
    shareableHeader = wrapper.find(ShareableHeader);
  });

  afterEach(function () {
    document.body.addEventListener.restore();
    document.body.removeEventListener.restore();
  });

  it('should assign global click handler to close share menu', function () {
    document.body.addEventListener.should.be.calledWith('click', shareableHeader.closeShareMenu);
  });

  it('should destroy global click handler on unmount', function () {
    document.body.removeEventListener.called.should.be.false();
    wrapper.unmount();
    document.body.removeEventListener.should.be.calledWith('click', shareableHeader.closeShareMenu);
  });
});

describe('ShareableHeader global scroll listener', function () {
  let wrapper;

  beforeEach(function () {
    stub(window, 'addEventListener');
    stub(window, 'removeEventListener');
    wrapper = shallow(<ShareableHeader />);
  });

  afterEach(function () {
    window.addEventListener.restore();
    window.removeEventListener.restore();
  });

  it('should assign global scroll handler to close share menu', function () {
    wrapper.instance().componentDidMount();
    window.addEventListener.should.be.calledWith('scroll', wrapper.instance().handleScroll);
  });

  it('should destroy global click handler on unmount', function () {
    window.removeEventListener.called.should.be.false();
    wrapper.instance().componentWillUnmount();
    window.removeEventListener.should.be.calledWith('scroll', wrapper.instance().handleScroll);
  });
});

