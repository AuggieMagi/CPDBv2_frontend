import React from 'react';
import { findDOMNode, render } from 'react-dom';

import RouteTransition from 'components/animation/route-transition';
import { unmountComponentSuppressError } from 'utils/test';
import { renderIntoDocument } from 'react-addons-test-utils';


describe('RouteTransition component', function () {
  let element;

  afterEach(function () {
    unmountComponentSuppressError(element);
  });

  it('should render child', function () {
    let testText = 'should be rendered';
    element = renderIntoDocument(<RouteTransition pathname='/path'><p>{ testText }</p></RouteTransition>);
    findDOMNode(element).innerHTML.should.containEql(testText);
  });

  it('should eventually render new child', function (callback) {
    let rootEl = document.createElement('div');
    const testChildren = [
      {
        path: '/path1',
        text: 'a b c'
      },
      {
        path: '/path2',
        text: 'd e f'
      }
    ];

    element = render(
      <RouteTransition pathname={ testChildren[0].path }><p>{ testChildren[0].text }</p></RouteTransition>,
      rootEl);

    render(
      <RouteTransition pathname={ testChildren[1].path }><p>{ testChildren[1].text }</p></RouteTransition>,
      rootEl, () => {
        rootEl.innerHTML.should.containEql(testChildren[0].text);
        setTimeout(() => {
          rootEl.innerHTML.should.containEql(testChildren[1].text);
          callback();
        }, 300);
      });
  });
});
