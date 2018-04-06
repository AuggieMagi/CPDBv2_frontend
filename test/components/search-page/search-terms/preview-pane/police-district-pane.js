import React from 'react';
import should from 'should';
import { renderIntoDocument,
  findRenderedComponentWithType,
  scryRenderedComponentsWithType
} from 'react-addons-test-utils';

import PoliceDistrictPane from 'components/search-page/search-terms/preview-pane/police-district-pane';
import {
  HeaderWidget,
  GeoInfoWidget,
  AllegationCountWidget,
  ListWidget,
  ViewWidget,
} from 'components/search-page/search-terms/preview-pane/widgets';


describe('PoliceDistrictPane component', () => {
  let instance;

  it('should contain the sub components', () => {
    instance = renderIntoDocument(<PoliceDistrictPane/>);
    should(findRenderedComponentWithType(instance, HeaderWidget)).not.be.null();
    should(findRenderedComponentWithType(instance, GeoInfoWidget)).not.be.null();
    should(findRenderedComponentWithType(instance, AllegationCountWidget)).not.be.null();
    scryRenderedComponentsWithType(instance, ListWidget).should.have.length(2);
    should(findRenderedComponentWithType(instance, ViewWidget)).not.be.null();
  });
});
