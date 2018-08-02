import React from 'react';
import should from 'should';
import {
  renderIntoDocument,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithClass,
  scryRenderedComponentsWithType, Simulate
} from 'react-addons-test-utils';
import { useFakeTimers } from 'sinon';

import { unmountComponentSuppressError, reRender } from 'utils/test';
import AnimatedRadarChart from 'components/officer-page/radar-chart';
import RadarExplainer from 'components/officer-page/radar-chart/explainer';
import StaticRadarChart from 'components/common/radar-chart';
import NoDataRadarChart from 'components/common/radar-chart/no-data-radar-chart';


describe('AnimatedRadarChart components', function () {
  let instance;
  const data = [{
    year: 2015,
    items: [
      { axis: 'Use of Force Reports', value: 20 },
      { axis: 'Civilian Complaints', value: 0 },
      { axis: 'Internal Complaints', value: 10 },
    ],
    textColor: 'black',
    visualTokenBackground: 'white'
  }, {
    year: 2016,
    items: [
      { axis: 'Use of Force Reports', value: 40 },
      { axis: 'Civilian Complaints', value: 50 },
      { axis: 'Internal Complaints', value: 60 },
    ],
    textColor: 'black',
    visualTokenBackground: 'white'
  }, {
    year: 2017,
    items: [
      { axis: 'Use of Force Reports', value: 80 },
      { axis: 'Civilian Complaints', value: 70 },
      { axis: 'Internal Complaints', value: 60 },
    ],
    textColor: 'black',
    visualTokenBackground: 'white'
  }];

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should render NoDataRadarChart if no data', function () {
    instance = renderIntoDocument(<AnimatedRadarChart/>);
    findRenderedComponentWithType(instance, NoDataRadarChart);
  });

  it('should render NoDataRadarChart if some data is missing', function () {
    const missingData = [{
      year: 2015,
      items: [
        { axis: 'Use of Force Reports', value: NaN },
        { axis: 'Civilian Complaints', value: 0 },
        { axis: 'Internal Complaints', value: 10 },
      ],
      textColor: 'black',
      visualTokenBackground: 'white'
    }, {
      year: 2016,
      items: [
        { axis: 'Use of Force Reports', value: 40 },
        { axis: 'Civilian Complaints', value: NaN },
        { axis: 'Internal Complaints', value: 60 },
      ],
      textColor: 'black',
      visualTokenBackground: 'white'
    }];
    instance = renderIntoDocument(<AnimatedRadarChart data={ missingData }/>);
    findRenderedComponentWithType(instance, NoDataRadarChart);
  });

  it('should render if data provided', function () {
    instance = renderIntoDocument(<AnimatedRadarChart data={ data }/>);
    findRenderedComponentWithType(instance, StaticRadarChart);
    findRenderedDOMComponentWithClass(instance, 'test--radar-explainer-question-mark');
    scryRenderedComponentsWithType(instance, RadarExplainer).should.have.length(0);
  });

  it('should rerender if data change', function () {
    instance = renderIntoDocument(<AnimatedRadarChart data={ [data[0]] }/>);

    instance = reRender(
      <AnimatedRadarChart data={ data }/>,
      instance
    );
    should(instance.timer).not.be.null();
  });

  it('should open the explainer clicking on the radar chart', function () {
    instance = renderIntoDocument(<AnimatedRadarChart data={ data }/>);
    scryRenderedComponentsWithType(instance, RadarExplainer).should.have.length(0);

    Simulate.click(findRenderedDOMComponentWithClass(instance, 'test--officer--radar-chart-placeholder'));

    findRenderedComponentWithType(instance, RadarExplainer);
  });



  describe('test animate', function () {
    let clock;
    beforeEach(function () {
      clock = useFakeTimers();

    });

    afterEach(function () {
      clock.restore();
    });

    it('should not animate if data length is 1', function () {
      const compactData = [data[0]];
      instance = renderIntoDocument(
        <AnimatedRadarChart data={ compactData }/>
      );

      should(instance.timer).be.null();
      clock.tick(30);
      should(instance.timer).be.null();
      instance.state.transitionValue.should.be.eql(0);
    });

    it('should change transition value after mounting', function () {

      instance = renderIntoDocument(
        <AnimatedRadarChart data={ data }/>
      );

      instance.state.transitionValue.should.eql(0);

      clock.tick(25);
      instance.state.transitionValue.should.eql(instance.velocity);

      clock.tick(500);
      instance.state.transitionValue.should.eql(2);

    });

    it('should end animation and start animation again when the explainer is closed', function () {
      instance = renderIntoDocument(<AnimatedRadarChart data={ data }/>);
      scryRenderedComponentsWithType(instance, RadarExplainer).should.have.length(0);

      Simulate.click(findRenderedDOMComponentWithClass(instance, 'test--officer--radar-chart-placeholder'));

      instance.state.transitionValue.should.eql(2);

      const explainer = findRenderedComponentWithType(instance, RadarExplainer);
      const closeButton = findRenderedDOMComponentWithClass(explainer, 'test--radar-explainer-close-button');

      Simulate.click(closeButton);

      instance.state.transitionValue.should.eql(0);
      scryRenderedComponentsWithType(instance, RadarExplainer).should.have.length(0);

      clock.tick(25);
      instance.state.transitionValue.should.eql(instance.velocity);
    });

    it('should not animate to years that data is missing', function () {
      const missingData = [{
        year: 2013,
        items: [
          { axis: 'Use of Force Reports', value: 20 },
          { axis: 'Civilian Complaints', value: NaN },
          { axis: 'Internal Complaints', value: 10 },
        ],
        textColor: 'black',
        visualTokenBackground: 'white'
      }, {
        year: 2014,
        items: [
          { axis: 'Use of Force Reports', value: 20 },
          { axis: 'Civilian Complaints', value: 0 },
          { axis: 'Internal Complaints', value: 10 },
        ],
        textColor: 'black',
        visualTokenBackground: 'white'
      }, {
        year: 2015,
        items: [
          { axis: 'Use of Force Reports', value: NaN },
          { axis: 'Civilian Complaints', value: 0 },
          { axis: 'Internal Complaints', value: 10 },
        ],
        textColor: 'black',
        visualTokenBackground: 'white'
      }, {
        year: 2016,
        items: [
          { axis: 'Use of Force Reports', value: 40 },
          { axis: 'Civilian Complaints', value: 50 },
          { axis: 'Internal Complaints', value: 60 },
        ],
        textColor: 'black',
        visualTokenBackground: 'white'
      }, {
        year: 2017,
        items: [
          { axis: 'Use of Force Reports', value: 80 },
          { axis: 'Civilian Complaints', value: 70 },
          { axis: 'Internal Complaints', value: NaN },
        ],
        textColor: 'black',
        visualTokenBackground: 'white'
      }];
      instance = renderIntoDocument(<AnimatedRadarChart data={ missingData }/>);

      instance.state.transitionValue.should.equal(0);
      instance.animatedData.should.have.length(2);
      instance.animatedData[0].year.should.equal(2014);

      clock.tick(25);
      instance.state.transitionValue.should.eql(instance.velocity);
      findRenderedComponentWithType(instance, StaticRadarChart).props.legendText.should.equal(2016);
      findRenderedComponentWithType(instance, StaticRadarChart).props.fadeOutLegend.should.be.false();

      clock.tick(200);
      findRenderedComponentWithType(instance, StaticRadarChart).props.legendText.should.equal(2016);
      findRenderedComponentWithType(instance, StaticRadarChart).props.fadeOutLegend.should.be.true();
    });
  });
});
