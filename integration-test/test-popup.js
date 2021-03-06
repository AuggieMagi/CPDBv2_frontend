'use strict';

require('should');

import crPage from './page-objects/cr-page';
import officerPage from './page-objects/officer-page';


describe('Popup', function () {
  beforeEach(function () {
    crPage.open();
  });

  it('should appear when clicking on the button', function () {
    crPage.accusedOfficers.popupButton.click();
    crPage.accusedOfficers.popup.waitForDisplayed();
    crPage.accusedOfficers.popupTitle.getText().should.equal('Accused Officer');
    crPage.accusedOfficers.popupText.getText().should.equal('Some accused officer explanation');
  });

  it('should close when clicking outside', function () {
    crPage.accusedOfficers.popupButton.click();
    crPage.accusedOfficers.popup.waitForDisplayed();
    $('body').click();
    crPage.accusedOfficers.popup.waitForDisplayed(1000, true);
  });

  it('should not close when clicking inside', function () {
    crPage.accusedOfficers.popupButton.click();
    crPage.accusedOfficers.popup.waitForDisplayed();
    crPage.accusedOfficers.popup.click();
    crPage.accusedOfficers.popup.waitForDisplayed();
  });

  it('should close when clicking on the close button', function () {
    crPage.accusedOfficers.popupButton.click();
    crPage.accusedOfficers.popup.waitForDisplayed();
    crPage.accusedOfficers.popupCloseButton.click();
    crPage.accusedOfficers.popup.waitForDisplayed(1000, true);
  });

  it('should close the previous popup when open new popup', function () {
    officerPage.open();
    officerPage.tabbedPaneSection.timelineSection.rankPopupButton.click();
    officerPage.tabbedPaneSection.timelineSection.rankPopup.waitForDisplayed();
    officerPage.tabbedPaneSection.timelineSection.salaryPopupButton.click();
    officerPage.tabbedPaneSection.timelineSection.salaryPopup.waitForDisplayed();
    officerPage.tabbedPaneSection.timelineSection.rankPopup.waitForDisplayed(1000, true);
  });
});
