import React from 'react';
import { Link } from 'react-router';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedComponentsWithType,
} from 'react-addons-test-utils';

import { unmountComponentSuppressError } from 'utils/test';
import EmptyPinboard from 'components/pinboard-page/empty-pinboard';
import { findDOMNode } from 'react-dom';

describe('EmptyPinboard component', function () {
  let instance;

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should have enough contents', function () {
    const examplePinboards = [{
      id: '66ef1561',
      title: 'Pinboard 1',
      description: 'Description 1'
    }, {
      id: '66ef1562',
      title: 'Pinboard 2',
      description: 'Description 2'
    }];

    instance = renderIntoDocument(<EmptyPinboard examplePinboards={ examplePinboards }/>);

    findDOMNode(instance).className.should.containEql('responsive-container');

    findRenderedDOMComponentWithClass(instance, 'empty-pinboard-title').textContent.should.equal('Add');
    findRenderedDOMComponentWithClass(instance, 'empty-pinboard-description').textContent.should.containEql(
      'Add officers, or complaint records through search.'
    ).and.containEql('Or use an example pinboard as a baseline to get started.');

    const examplePinboardLinks = scryRenderedComponentsWithType(instance, Link);
    examplePinboardLinks.should.have.length(2);

    examplePinboardLinks[0].props.to.should.equal('/pinboard/66ef1561/');
    findRenderedDOMComponentWithClass(
      examplePinboardLinks[0], 'title'
    ).textContent.should.equal('Pinboard 1');
    findRenderedDOMComponentWithClass(
      examplePinboardLinks[0], 'description'
    ).textContent.should.equal('Description 1…');

    examplePinboardLinks[1].props.to.should.equal('/pinboard/66ef1562/');
    findRenderedDOMComponentWithClass(
      examplePinboardLinks[1], 'title'
    ).textContent.should.equal('Pinboard 2');
    findRenderedDOMComponentWithClass(
      examplePinboardLinks[1], 'description'
    ).textContent.should.equal('Description 2…');

    findRenderedDOMComponentWithClass(instance, 'arrow-head');
    findRenderedDOMComponentWithClass(instance, 'arrow-shaft');
  });
});