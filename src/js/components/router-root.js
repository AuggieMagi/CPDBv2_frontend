import React, { Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import AppContainer from 'containers/app-container';
import LandingPageContainer from 'containers/landing-page';
import CollaborationPage from 'components/collaboration-page/collaboration-page';
import FAQPage from 'components/faq-page/faq-page';
import SearchPageContainer from 'containers/search-page-container';
import InlineAliasAdminContainer from 'containers/inline-alias-admin-container';
import ReportingPage from 'components/reporting-page';
import {
  COLLAB_PATH, FAQ_PATH, STORIES_PATH, SEARCH_PATH, OFFICER_PATH, OFFICER_TIMELINE_PATH, CR_PATH,
  UNIT_PROFILE_PATH, SEARCH_ALIAS_EDIT_PATH, INLINE_SEARCH_ALIAS_ADMIN_PATH
} from 'utils/constants';
import configureStore from 'store';
import history from 'utils/history';


const store = configureStore();

class RouterRoot extends Component {

  render() {
    const routes = [
      <IndexRoute component={ LandingPageContainer } key='1'
        onEnter={ () => global.ga('send', 'screenview', { screenName: 'Landing' }) }/>,
      <Route path={ STORIES_PATH } component={ ReportingPage } key='2'
        onEnter={ () => global.ga('send', 'screenview', { screenName: 'Stories' }) }>
        <Route path={ ':reportId' } component={ ReportingPage }/>
      </Route>,
      <Route path={ COLLAB_PATH } component={ CollaborationPage } key='3'
        onEnter={ () => global.ga('send', 'screenview', { screenName: 'Collaborate' }) }/>,
      <Route path={ FAQ_PATH } component={ FAQPage } key='4'
        onEnter={ () => global.ga('send', 'screenview', { screenName: 'FAQs' }) }>
        <Route path={ ':faqId' } component={ FAQPage }/>
      </Route>,
      <Route path={ OFFICER_PATH } component={ SearchPageContainer } key='5'/>,
      <Route path={ OFFICER_TIMELINE_PATH } component={ SearchPageContainer } key='6'/>,
      <Route path={ SEARCH_PATH } component={ SearchPageContainer } key='7'/>,
      <Route path={ CR_PATH } component={ SearchPageContainer } key='8'/>,
      <Route path={ UNIT_PROFILE_PATH } component={ SearchPageContainer } key='9'/>,
      <Route path={ SEARCH_ALIAS_EDIT_PATH } component={ SearchPageContainer } key='10'/>,
      <Route path={ INLINE_SEARCH_ALIAS_ADMIN_PATH } component={ InlineAliasAdminContainer } key='11' />
    ];

    return (
      <Provider store={ store }>
        <Router history={ history }>
          <Route path='/(edit)' component={ AppContainer }>
            { routes }
          </Route>
        </Router>
      </Provider>
    );
  }
}

export default DragDropContext(HTML5Backend)(RouterRoot);
