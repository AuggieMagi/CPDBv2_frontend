import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import browserHistory from 'utils/history';
import sinon from 'sinon';
import Mousetrap from 'mousetrap';
import MockStore from 'redux-mock-store';
import RootReducer from 'reducers/root-reducer';
import { createStore } from 'redux';
import { Promise } from 'es6-promise';

import * as navigateUtils from 'utils/navigate-to-search-item';
import SearchPage from 'components/search-page';
import * as intercomUtils from 'utils/intercom';
import { NavigationItem } from 'utils/test/factories/suggestion';
import SearchTags from 'components/search-page/search-tags';
import SearchBox from 'components/search-page/search-box';
import { MORE_BUTTON, RECENT_CONTENT_TYPE } from 'utils/constants';
import * as IntercomTracking from 'utils/intercom-tracking';
import * as LayeredKeyBinding from 'utils/layered-key-binding';


describe('SearchPage component', function () {
  const state = {
    searchPage: {
      tags: [],
      navigation: {},
      searchTerms: {
        categories: [],
        hidden: true,
        navigation: {
          itemIndex: 0,
        },
      },
      recentSuggestions: [],
      pagination: {},
    },
    pinboardPage: {
      pinboard: null,
    },
  };
  const store = MockStore()(state);

  beforeEach(function () {
    this.browserHistoryPush = sinon.stub(browserHistory, 'push');
  });

  it('should not call get suggestion api when query is empty', function () {
    const clock = sinon.useFakeTimers();
    const getSuggestionSpy = sinon.stub().returns({ catch: sinon.spy() });
    mount(
      <Provider store={ store }>
        <SearchPage
          getSuggestion={ getSuggestionSpy }
          query=''
        />
      </Provider>
    );
    clock.tick(600);

    getSuggestionSpy.should.not.be.called();
  });

  it('should call get suggestion api when query is set', function () {
    const clock = sinon.useFakeTimers();
    const getSuggestionSpy = sinon.stub().returns({ catch: sinon.spy() });
    mount(
      <Provider store={ store }>
        <SearchPage
          getSuggestion={ getSuggestionSpy }
          query='a'
        />
      </Provider>
    );
    clock.tick(600);

    getSuggestionSpy.should.be.calledWith('a', { limit: 9 });
  });

  it('should call browserHistory.push when user click on searchbar__button--back', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage cancelPathname='/pinboard/123abc/'/>
      </Provider>
    );

    const backButton = wrapper.find('.searchbar__button--back').first();
    backButton.simulate('click');
    this.browserHistoryPush.should.be.calledOnce();
    this.browserHistoryPush.should.be.calledWith('/pinboard/123abc/');
  });

  it('should call router.goBack when user hit ESCAPE', function () {
    mount(
      <Provider store={ store }>
        <SearchPage />
      </Provider>
    );

    Mousetrap.trigger('esc');
    this.browserHistoryPush.should.be.calledWith('/');
  });

  it('should bind and unbind esc and enter keys when mounted/unmounted but not hide', function () {
    const bindSpy = sinon.spy(LayeredKeyBinding, 'bind');
    const unbindSpy = sinon.spy(LayeredKeyBinding, 'unbind');

    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage hide={ false }/>
      </Provider>
    );

    const instance = wrapper.find(SearchPage).instance();
    bindSpy.should.be.calledWith('esc', instance.handleGoBack);
    bindSpy.should.be.calledWith('enter', instance.handleViewItem);

    wrapper.unmount();

    unbindSpy.should.be.calledWith('esc');
    unbindSpy.should.be.calledWith('enter');
  });

  it('should not bind and unbind esc and enter keys when mounted/unmounted but hide', function () {
    const bindSpy = sinon.spy(LayeredKeyBinding, 'bind');
    const unbindSpy = sinon.spy(LayeredKeyBinding, 'unbind');

    let wrapper = mount(
      <Provider store={ store }>
        <SearchPage hide={ true }/>
      </Provider>
    );

    bindSpy.should.not.be.calledWith('esc', sinon.match.any);
    bindSpy.should.not.be.calledWith('enter', sinon.match.any);

    wrapper.unmount();

    unbindSpy.should.not.be.calledWith('esc');
    unbindSpy.should.not.be.calledWith('enter');
  });

  it('should bind and unbind when update hide prop', function () {
    const bindSpy = sinon.spy(LayeredKeyBinding, 'bind');
    const unbindSpy = sinon.spy(LayeredKeyBinding, 'unbind');

    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage hide={ true }/>
      </Provider>
    );

    const instance = wrapper.find(SearchPage).instance();

    bindSpy.should.not.be.calledWith('esc', sinon.match.any);
    bindSpy.should.not.be.calledWith('enter', sinon.match.any);
    unbindSpy.should.not.be.calledWith('esc');
    unbindSpy.should.not.be.calledWith('enter');

    wrapper.setProps({
      children: <SearchPage hide={ false }/>,
    });

    bindSpy.should.be.calledWith('esc', instance.handleGoBack);
    bindSpy.should.be.calledWith('enter', instance.handleViewItem);
    unbindSpy.should.not.be.calledWith('esc');
    unbindSpy.should.not.be.calledWith('enter');

    wrapper.setProps({
      children: <SearchPage hide={ true }/>,
    });

    unbindSpy.should.be.calledWith('esc');
    unbindSpy.should.be.calledWith('enter');
    unbindSpy.resetHistory();

    wrapper.setProps({
      children: <SearchPage hide={ false }/>,
    });

    wrapper.unmount();

    unbindSpy.should.be.calledWith('esc');
    unbindSpy.should.be.calledWith('enter');
  });

  it('should not change the current search path when user type in search box', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage searchTermsHidden={ false }/>
      </Provider>
    );
    const searchBox = wrapper.find(SearchBox);
    searchBox.prop('onChange')({ currentTarget: { value: 'jer' } });
    this.browserHistoryPush.called.should.be.false();
  });

  it('should change the search box with correct text if there is queryPrefix', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage query='jerome' queryPrefix='officer'/>
      </Provider>
    );
    const searchBox = wrapper.find(SearchBox);
    searchBox.prop('value').should.equal('officer:jerome');
  });

  describe('handleViewItem', function () {
    it('should use browserHistory.push() if visiting focused item with internal link', function () {
      mount(
        <Provider store={ store }>
          <SearchPage focusedItem={ NavigationItem.build({ to: '/dummy/url' }) } />
        </Provider>
      );
      Mousetrap.trigger('enter');
      this.browserHistoryPush.should.be.calledWith('/dummy/url');
    });

    it('should call handleSelect to show more suggestion items when entering on More button', function () {
      const wrapper = mount(
        <Provider store={ store }>
          <SearchPage
            focusedItem={ NavigationItem.build({ id: 'OFFICER', 'type': MORE_BUTTON }) }
          />
        </Provider>
      );
      const handleSelectStub = sinon.stub(wrapper.find(SearchPage).instance(), 'handleSelect');
      Mousetrap.trigger('enter');
      handleSelectStub.calledWith('OFFICER');
    });

    it('should call handleSearchBoxEnter when user hits ENTER, there is no result and SearchBox is unfocused',
      function () {
        const navigateToSearchItem = sinon.stub(navigateUtils, 'navigateToSearchItem');
        mount(
          <Provider store={ store }>
            <SearchPage query='no-result'/>
          </Provider>
        );
        Mousetrap.trigger('down');
        Mousetrap.trigger('down');
        Mousetrap.trigger('enter');

        navigateToSearchItem.calledOnce.should.be.true();
      }
    );
  });

  it('should call api with content type when user select a tag', function () {
    const selectTagSpy = sinon.spy();
    const tags = ['a', 'b'];

    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage
          selectTag={ selectTagSpy }
          tags={ tags }
          query={ 'a' }
        />
      </Provider>
    );

    const suggestionTagsElement = wrapper.find(SearchTags);
    const tagElements = suggestionTagsElement.find('span');
    tagElements.first().simulate('click');

    selectTagSpy.should.be.calledWith('a');
  });

  it('should not call api when select recent content', function () {
    const getSuggestionWithContentType = sinon.spy();
    const getSuggestion = sinon.stub().returns({ catch: sinon.spy() });
    const tags = [RECENT_CONTENT_TYPE, 'b'];
    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage
          getSuggestionWithContentType={ getSuggestionWithContentType }
          getSuggestion={ getSuggestion }
          tags={ tags }
          query='a'
        />
      </Provider>
    );
    const suggestionTagsElement = wrapper.find(SearchTags);
    const tagElements = suggestionTagsElement.find('span');

    getSuggestion.reset();

    tagElements.first().simulate('click');
    getSuggestionWithContentType.called.should.be.false();
    getSuggestion.called.should.be.false();
  });

  it('should call selectTag(null) when user deselect a tag', function () {
    const tags = ['a', 'b'];
    const selectTagSpy = sinon.spy();

    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage tags={ tags } selectTag={ selectTagSpy } contentType='a' query='c' />
      </Provider>
    );

    const suggestionTagsElement = wrapper.find(SearchTags);
    const tagElements = suggestionTagsElement.find('span');
    tagElements.first().simulate('click');
    selectTagSpy.should.be.calledWith(null);
  });

  it('should call resetSearchResultNavigation if SearchPage resetNavigation is called when Search Term is hidden',
    function () {
      const resetSearchResultNavigation = sinon.stub();
      const resetSearchTermNavigation = sinon.stub();

      const wrapper = shallow(
        <Provider store={ store }>
          <SearchPage
            resetSearchResultNavigation={ resetSearchResultNavigation }
            resetSearchTermNavigation={ resetSearchTermNavigation }
          />
        </Provider>
      );

      const searchPage = wrapper.find(SearchPage).dive();
      searchPage.instance().resetNavigation(1);
      resetSearchResultNavigation.should.be.calledWith(1);
    });

  it('should not call getSuggestion while query does not change', function () {
    const clock = sinon.useFakeTimers();
    const getSuggestionSpy = sinon.stub().returns({ catch: sinon.spy() });

    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage
          suggestionGroups={ ['abc'] }
          isRequesting={ false }
          query='abc'
          getSuggestion={ getSuggestionSpy } />
      </Provider>
    );

    clock.tick(600);
    getSuggestionSpy.should.be.calledOnce();
    getSuggestionSpy.resetHistory();

    wrapper.setProps({
      children: (
        <SearchPage
          suggestionGroups={ [] }
          isRequesting={ true }
          query='abc'
          getSuggestion={ getSuggestionSpy }/>
      ),
    });

    clock.tick(600);

    getSuggestionSpy.should.not.be.called();
  });

  it('should throttle getSuggestion calls and only keep the call with the latest query', function () {
    const clock = sinon.useFakeTimers();
    const getSuggestionSpy = sinon.stub().returns({ catch: sinon.spy() });

    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage
          suggestionGroups={ ['abc'] }
          isRequesting={ false }
          query='abc'
          getSuggestion={ getSuggestionSpy } />
      </Provider>
    );

    wrapper.setProps({
      children: (
        <SearchPage
          suggestionGroups={ [] }
          isRequesting={ true }
          query='abcd'
          getSuggestion={ getSuggestionSpy }/>
      ),
    });

    wrapper.setProps({
      children: (
        <SearchPage
          suggestionGroups={ [] }
          isRequesting={ true }
          query='abcde'
          getSuggestion={ getSuggestionSpy }/>
      ),
    });

    clock.tick(600);

    getSuggestionSpy.should.be.calledOnce();
    getSuggestionSpy.should.be.calledWith('abcde', { limit: 9 });
  });

  it('should not call api when query changed to emtpy', function () {
    const clock = sinon.useFakeTimers();
    const selectTagSpy = sinon.spy();
    const getSuggestionSpy = sinon.stub().returns({ catch: sinon.spy() });
    const getSuggestionWithContentTypeSpy = sinon.stub().returns({ catch: sinon.spy() });

    const wrapper = mount(
      <Provider store={ store }>
        <SearchPage
          suggestionGroups={ ['abc'] }
          isEmpty={ false }
          isRequesting={ false }
          query='abc'
          selectTag={ selectTagSpy }
          getSuggestion={ getSuggestionSpy }
          getSuggestionWithContentType={ getSuggestionWithContentTypeSpy } />
      </Provider>
    );
    selectTagSpy.resetHistory();

    clock.tick(600);
    getSuggestionSpy.should.be.calledOnce();
    getSuggestionSpy.resetHistory();

    wrapper.setProps({
      children: (
        <SearchPage
          suggestionGroups={ ['abc'] }
          isEmpty={ false }
          isRequesting={ false }
          contentType='OFFICER'
          query=''
          selectTag={ selectTagSpy }
          getSuggestion={ getSuggestionSpy }
          getSuggestionWithContentType={ getSuggestionWithContentTypeSpy }
        />
      ),
    });

    clock.tick(600);

    selectTagSpy.should.not.be.called();
    getSuggestionSpy.should.not.be.called();
    getSuggestionWithContentTypeSpy.should.not.be.called();
  });

  describe('Intercom', function () {
    describe('Intercom launcher', function () {
      beforeEach(function () {
        sinon.stub(intercomUtils, 'showIntercomLauncher');
      });

      it('should hide intercom launcher when mounted', function () {
        mount(
          <Provider store={ store }>
            <SearchPage/>
          </Provider>
        );
        intercomUtils.showIntercomLauncher.should.be.calledWith(false);
      });

      it('should show intercom launcher again when unmounted', function () {
        const wrapper = mount(
          <Provider store={ store }>
            <SearchPage/>
          </Provider>
        );

        wrapper.unmount();
        intercomUtils.showIntercomLauncher.should.be.calledWith(true);
      });
    });

    describe('Intercom tracking', function () {
      beforeEach(function () {
        sinon.stub(IntercomTracking, 'trackSearchPage');
      });

      it('should track Intercom with search page', function () {
        mount(
          <Provider store={ store }>
            <SearchPage/>
          </Provider>
        );
        IntercomTracking.trackSearchPage.should.be.called();
      });
    });
  });

  it('should handle when click on pinboard button if pinboard is not exist', function (done) {
    const store = createStore(RootReducer, state);
    const createNewEmptyPinboardStub = sinon.stub().usingPromise(Promise).resolves({
      payload: {
        id: '5cd06f2b',
        url: '/pinboard/5cd06f2b/',
      },
    });

    const wrapper = shallow(
      <Provider store={ store }>
        <SearchPage
          createNewEmptyPinboard={ createNewEmptyPinboardStub }
        />
      </Provider>
    );

    const searchPage = wrapper.find(SearchPage).dive();
    searchPage.instance().handleEmptyPinboardButtonClick();

    createNewEmptyPinboardStub.should.be.called();

    setTimeout(() => {
      this.browserHistoryPush.should.be.called();
      done();
    }, 50);
  });
});
