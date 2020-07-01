import { stub, spy, useFakeTimers } from 'sinon';
import { Promise } from 'es6-promise';

import * as tracking from 'utils/tracking';
import axiosClient from 'utils/axios-client';
import { TRACKING_API_URL } from 'utils/constants';
import browserHistory from 'utils/history';


describe('tracking utils', function () {
  describe('ga and clicky script is loaded', function () {
    beforeEach(function () {
      global.gaLoaded = true;
      stub(global, 'ga');
      stub(global.clicky, 'log');
      browserHistory.push('/');
    });

    describe('trackSwipeLandingPageCarousel', function () {
      it('should send event analytic', function () {
        tracking.trackSwipeLandingPageCarousel('left', 'type');

        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'landing_page_carousel',
          eventAction: 'swipe_left',
          eventLabel: 'type',
        });
        global.clicky.log.should.be.calledWith(document.location.pathname, 'swipe_left_type');
      });
    });

    describe('trackOutboundLink', function () {
      it('should send event analytic', function () {
        tracking.trackOutboundLink('localhost');

        const args = global.ga.getCall(0).args;
        args[0].should.equal('send');
        args[1].hitType.should.equal('event');
        args[1].eventCategory.should.equal('outbound');
        args[1].eventAction.should.equal('click');
        args[1].eventLabel.should.equal('localhost');
        args[1].transport.should.equal('beacon');
        args[1].hitCallback.should.be.ok();

        global.clicky.log.should.be.calledWith(document.location.pathname, 'localhost', 'outbound');
      });

      it('should open url if windowName is passed', function () {
        stub(window, 'open');

        tracking.trackOutboundLink('localhost', '_blank');
        window.open.should.be.calledOnce();
        window.open.should.be.calledWith('localhost', '_blank');
      });
    });

    describe('trackPageView', function () {
      it('should send event analytic', function () {
        tracking.trackPageView('pathname');

        global.ga.should.be.calledWith('send', {
          hitType: 'pageview',
          page: 'pathname',
        });
        global.clicky.log.should.not.be.called();
      });
    });

    describe('trackSearchResultsCount', function () {
      it('should send event analytic', function () {
        tracking.trackSearchResultsCount(12);

        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'search',
          eventAction: 'num_results',
          eventValue: 12,
        });
        global.clicky.log.should.be.calledWith(document.location.pathname, 'num_results: 12');
      });
    });

    describe('trackSingleSearchResults', function () {
      it('should send event analytic', function () {
        tracking.trackSingleSearchResults('contentType', 'query', 123);

        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'contentType',
          eventAction: 'single_search',
          eventLabel: 'query',
          eventValue: 123,
        });
        global.clicky.log.should.be.calledWith(
          document.location.pathname, 'single_search_query: query with 123 results'
        );
      });
    });

    describe('trackSearchFocusedItem', function () {
      it('should send event analytic at most once in 500ms', function () {
        const clock = useFakeTimers();

        tracking.trackSearchFocusedItem('contentType', 'query', 'itemId1', 1);
        tracking.trackSearchFocusedItem('contentType', 'query', 'itemId2', 2);
        clock.tick(550);

        global.ga.should.be.calledTwice();
        global.clicky.log.should.be.calledTwice();
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'contentType',
          eventAction: 'suggestion_click',
          eventLabel: 'itemId2',
          eventValue: 2,
        });
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'contentType',
          eventAction: 'suggestion_click_with_query',
          eventLabel: 'itemId2 - query',
          eventValue: 2,
        });
        global.clicky.log.should.be.calledWith(document.location.pathname, 'Item itemId2 with rank 2 is focused');
        global.clicky.log.should.be.calledWith(
          document.location.pathname,
          'Item itemId2 with rank 2 is focused via "query" query'
        );

        clock.tick(1000);
        tracking.trackSearchFocusedItem('contentType', 'query', 'itemId3');
        clock.tick(550);

        global.ga.callCount.should.equal(4);
      });
    });

    describe('trackSearchQuery', function () {
      it('should send event analytic at most once in 500ms', function () {
        const clock = useFakeTimers();

        tracking.trackSearchQuery('que');
        tracking.trackSearchQuery('quer');
        clock.tick(550);

        global.ga.should.be.calledOnce();
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'search',
          eventAction: 'change_query',
          eventLabel: 'quer',
        });
        global.clicky.log.should.be.calledOnce();
        global.clicky.log.should.be.calledWith(document.location.pathname, 'change_query: quer');

        clock.tick(1000);
        tracking.trackSearchQuery('query');
        clock.tick(550);

        global.ga.should.be.calledTwice();
        global.clicky.log.should.be.calledTwice();
      });
    });

    describe('trackCommunityClick', function () {
      it('should send event analytic', function () {
        tracking.trackCommunityClick('communityName');

        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'community',
          eventAction: 'click',
          eventLabel: 'communityName',
        });
        global.clicky.log.should.be.calledWith(document.location.pathname, 'community: communityName');
      });
    });

    describe('trackOpenExplainer', function () {
      it('should send event analytic', function () {
        tracking.trackOpenExplainer(123);

        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'visual_token_explainer',
          eventAction: 'open',
          eventValue: 123,
        });
        global.clicky.log.should.be.calledWith(document.location.pathname, 'open_visual_token_explainer: 123');
      });
    });

    describe('trackRelatedByCategoryClick', function () {
      it('should send event analytic', function () {
        tracking.trackRelatedByCategoryClick('01234', '56789');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'related_by_category',
          eventAction: 'click',
          eventLabel: 'Source CRID: 01234 - Target CRID: 56789',
        });
        global.clicky.log.should.be.calledWith(
          document.location.pathname,
          'related_by_category: Source CRID 01234 - Target CRID 56789'
        );
      });
    });

    describe('trackRelatedByAccusedClick', function () {
      it('should send event analytic', function () {
        tracking.trackRelatedByAccusedClick('01234', '56789');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'related_by_accused',
          eventAction: 'click',
          eventLabel: 'Source CRID: 01234 - Target CRID: 56789',
        });
        global.clicky.log.should.be.calledWith(
          document.location.pathname,
          'related_by_accused: Source CRID 01234 - Target CRID 56789'
        );
      });
    });

    describe('trackAttachmentClick', function () {
      it('should send event analytic', function () {
        tracking.trackAttachmentClick('/', '/complaint/123456/');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'attachment_click',
          eventAction: 'click',
          eventLabel: 'Source URL: / - Target URL: /complaint/123456/',
        });
        global.clicky.log.should.be.calledWith(
          document.location.pathname,
          'attachment_click: Source URL / - Target URL /complaint/123456/'
        );
      });
    });

    describe('trackPopupButtonClick', function () {
      it('should send event analytic', function () {
        tracking.trackPopupButtonClick('/officer/8562/jerome-finnigan/', 'Rank');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'popup_click',
          eventAction: 'click',
          eventLabel: '/officer/8562/jerome-finnigan/ - Rank',
        });
        global.clicky.log.should.be.calledWith(
          document.location.pathname,
          'popup_click: /officer/8562/jerome-finnigan/ - Rank'
        );
      });
    });

    describe('trackOfficerDownload', function () {
      it('should send event analytic', function () {
        tracking.trackOfficerDownload(8562, 'download', 'without_docs');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'officer_data',
          eventAction: 'download',
          eventValue: 8562,
          eventLabel: 'without_docs',
        });
        global.clicky.log.should.be.calledWith(document.location.pathname, 'officer_data: 8562');
      });
    });

    describe('trackOfficerDownloadMenu', function () {
      it('should send event analytic', function () {
        tracking.trackOfficerDownloadMenu(8562, 'open');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'officer_download_menu',
          eventAction: 'open',
          eventValue: 8562,
        });
        global.clicky.log.should.be.calledWith(document.location.pathname, 'open_officer_download_menu: 8562');
      });
    });

    describe('trackDocumentEdit', function () {
      it('should send event analytic', function () {
        tracking.trackDocumentEdit(1234, 'title');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'document_edit',
          eventAction: 'edit',
          eventLabel: 'Document ID: 1234 - Field: title',
        });
        global.clicky.log.should.be.calledWith(
          document.location.pathname,
          'document_edit: Document ID 1234 - Field title'
        );
      });
    });

    describe('trackDocumentRequest', function () {
      it('should send event analytic', function () {
        tracking.trackDocumentRequest('CR', '309887', 'cpdp@cpdp.co');
        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'document_request',
          eventAction: 'request',
          eventLabel: 'CR 309887 - Email cpdp@cpdp.co',
        });
        global.clicky.log.should.be.calledWith(
          '/',
          'document_request: CR 309887 - Email cpdp@cpdp.co',
        );
      });
    });
  });

  describe('ga and clicky script is unable to load', function () {
    beforeEach(function () {
      global.gaLoaded = false;
      stub(global, 'ga').value(null);
      stub(global, 'clicky').value(null);
      stub(axiosClient, 'post').returns(new Promise(resolve => resolve()));
      browserHistory.push('/');
    });

    it('should post tracking data to server', function () {
      tracking.trackOfficerDownloadMenu('123', 'click');
      const expectedTrackingParams = {
        clicky: {
          title: 'open_officer_download_menu: 123',
          href: document.location.pathname,
        },
        ga: {
          'hit_type': 'event',
          'event_category': 'officer_download_menu',
          'event_action': 'click',
          'event_label': undefined,
          'event_value': '123',
          'page': undefined,
        },
      };
      axiosClient.post.should.be.calledWith(TRACKING_API_URL, expectedTrackingParams);
    });

    describe('trackOutboundLink', function () {
      it('should open url if windowName is passed', function () {
        stub(window, 'open');
        tracking.trackOutboundLink('documentcloud.com', '_blank');

        const expectedTrackingParams = {
          clicky: {
            title: 'documentcloud.com',
            type: 'outbound',
            href: document.location.pathname,
          },
          ga: {
            'hit_type': 'event',
            'event_category': 'outbound',
            'event_action': 'click',
            'event_label': 'documentcloud.com',
            'event_value': undefined,
            'page': undefined,
          },
        };
        axiosClient.post.should.be.calledWith(TRACKING_API_URL, expectedTrackingParams);

        window.open.should.be.calledOnce();
        window.open.should.be.calledWith('documentcloud.com', '_blank');
      });
    });

    describe('trackPageView', function () {
      it('should post tracking data to server', function () {
        tracking.trackPageView('/officer/123/');

        const expectedTrackingParams = {
          clicky: {
            type: 'pageview',
            href: document.location.pathname,
          },
          ga: {
            'hit_type': 'pageview',
            'event_category': undefined,
            'event_action': undefined,
            'event_label': undefined,
            'event_value': undefined,
            'page': '/officer/123/',
          },
        };
        axiosClient.post.should.be.calledWith(TRACKING_API_URL, expectedTrackingParams);
      });
    });

    describe('trackDocumentRequest', function () {
      it('should post tracking data to server', function () {
        tracking.trackDocumentRequest('CR', '309887', 'cpdp@cpdp.co');

        const expectedTrackingParams = {
          clicky: {
            href: '/',
            title: 'document_request: CR 309887 - Email cpdp@cpdp.co',
          },
          ga: {
            'event_action': 'request',
            'event_category': 'document_request',
            'event_label': 'CR 309887 - Email cpdp@cpdp.co',
            'event_value': undefined,
            'hit_type': 'event',
            'page': undefined,
          },
        };
        axiosClient.post.should.be.calledWith(TRACKING_API_URL, expectedTrackingParams);
      });
    });
  });

  describe('clicky script is unable to load', function () {
    beforeEach(function () {
      stub(global, 'clicky').value(null);
      global.gaLoaded = true;
      spy(global, 'ga');
      stub(axiosClient, 'post').usingPromise(Promise).resolves({});
    });

    describe('trackSwipeLandingPageCarousel', function () {
      it('should send correct analytic data', function () {
        tracking.trackSwipeLandingPageCarousel('left', 'type');

        global.ga.should.be.calledWith('send', {
          hitType: 'event',
          eventCategory: 'landing_page_carousel',
          eventAction: 'swipe_left',
          eventLabel: 'type',
        });
        const expectedClickyTrackingParams = {
          href: document.location.pathname,
          title: 'swipe_left_type',
        };
        axiosClient.post.should.be.calledWith(TRACKING_API_URL, { clicky: expectedClickyTrackingParams });
      });
    });
  });
});
