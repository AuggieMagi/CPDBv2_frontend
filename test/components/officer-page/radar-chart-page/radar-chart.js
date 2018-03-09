import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType
} from 'react-addons-test-utils';
import { spy } from 'sinon';

import { unmountComponentSuppressError } from 'utils/test';
import OfficerRadarDemoPage from 'components/officer-page/radar-chart-page';
import OfficerRadarChart from 'components/officer-page/radar-chart-page/animated-radar-chart';


describe('Officer Radar Page components', function () {
  let instance;

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should render appropriately', function () {
    const fetchPercentileCallback = spy();

    instance = renderIntoDocument(
      <OfficerRadarDemoPage officerId={ 1 } fetchPercentile={ fetchPercentileCallback }/>
    );
    findRenderedComponentWithType(instance, OfficerRadarChart);
    fetchPercentileCallback.calledWith(1).should.be.true();
  });
});
