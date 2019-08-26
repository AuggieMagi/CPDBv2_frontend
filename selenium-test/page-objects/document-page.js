'use strict';

import Page from './page';
import LoginScreen from './sections/login-screen';

const getInfoItemSelector = (text) =>
  `//div[contains(@class, "document-info")]//*[@class="list-item" and span[text()="${text}"]]`;

class DocumentPage extends Page {
  constructor() {
    super();

    this.loginScreen = new LoginScreen();
    this.prepareElementGetters({
      crid: getInfoItemSelector('CRID / UID'),
      source: getInfoItemSelector('Source'),
      crawler: getInfoItemSelector('Crawler'),
      date: getInfoItemSelector('Date'),
      views: getInfoItemSelector('Views'),
      downloads: getInfoItemSelector('Downloads'),
      notifications: getInfoItemSelector('Notifications'),
      lastEdited: '.main-section-last-edited',
      thumbnail: '.document-thumbnail-img',
      pageCount: '.document-thumbnail-page-count',
      linkedDocuments: '.linked-documents-content',
      linkedDocumentsTitle: '.linked-documents-title',
      linkedDocumentsThumbnails: '.linked-documents-thumbnail',
      documentTitle: '.main-section-title .editable-text-box-text',
      documentText: '.main-section-full-text .editable-text-box-text-multiline',
      lastUpdatedBy: '.main-section-last-edited',
    });
  }

  open(id=1, login=false) {
    super.open(`${ login ? '/edit': '' }/document/${id}/`);
    login && this.loginScreen.login();
  }
}

module.exports = new DocumentPage();
