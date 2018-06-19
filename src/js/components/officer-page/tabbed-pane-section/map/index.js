import React, { Component, PropTypes } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';

import { MAP_INFO, MAP_ITEMS } from 'utils/constants';
import { mapboxgl } from 'utils/vendors';
import Legend from './legend';
import { mapStyle, wrapperStyle } from './map.style';
import MarkerTooltip from './marker-tooltip';
import SimpleMarkerTooltip from './simple-marker-tooltip';
import Marker from './marker';


export default class Map extends Component {
  componentWillReceiveProps(nextProps, nextState) {
    nextProps.markers.map(marker => {
      this.addMarker(marker);
    });
  }

  gotRef(el) {
    if (el && !this.map) {
      this.map = new mapboxgl.Map({
        container: el,
        style: 'mapbox://styles/mapbox/light-v9',
        zoom: MAP_INFO.ZOOM1,
        center: [MAP_INFO.CENTER_LNG, MAP_INFO.CENTER_LAT],
        interactive: true,
        scrollZoom: false,
      });
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

      this.props.markers.map(marker => {
        this.addMarker(marker);
      });
    }
  }

  createPopup(marker) {
    const popup = new mapboxgl.Popup({ offset: 0, closeButton: false });
    let tooltip;
    if (marker.kind === MAP_ITEMS.CR) {
      tooltip = (
        <MarkerTooltip
          id={ marker.id }
          kind={ marker.kind }
          category={ marker.category }
          coaccused={ marker.coaccused }
          victims={ marker.victims }
        />
      );
    } else if (marker.kind === MAP_ITEMS.FORCE) {
      tooltip = (
        <SimpleMarkerTooltip
          kind='TRR'
          id={ marker.id }
          category={ marker.category }
        />
      );
    }
    popup.setHTML(ReactDOMServer.renderToString(tooltip));
    return popup;
  }

  addMarker(marker) {
    const { openComplaintPage, openTRRPage } = this.props;
    const popup = this.createPopup(marker);

    const markerEl = document.createElement('div');
    this.marker = new mapboxgl.Marker(markerEl);
    this.marker.setLngLat([marker.point.lon, marker.point.lat]);
    this.marker.setPopup(popup);
    this.marker.addTo(this.map);

    ReactDOM.render(
      <Marker
        id={ marker.id }
        kind={ marker.kind }
        finding={ marker.finding }
        mapboxMarker={ this.marker }
        openComplaintPage={ openComplaintPage }
        openTRRPage={ openTRRPage }
      />,
      markerEl
    );
  }

  render() {
    const { legend } = this.props;
    return (
      <div className='test--officer-map' style={ wrapperStyle }>
        <div ref={ this.gotRef.bind(this) } style={ mapStyle } />
        <Legend legend={ legend } />
      </div>
    );
  }
}

Map.propTypes = {
  legend: PropTypes.shape({
    allegationCount: PropTypes.number,
    sustainedCount: PropTypes.number,
    useOfForceCount: PropTypes.number
  }),
  openComplaintPage: PropTypes.func,
  openTRRPage: PropTypes.func,
  markers: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        point: PropTypes.shape({
          lat: PropTypes.number,
          lon: PropTypes.number
        }),
        kind: PropTypes.string,
        finding: PropTypes.string,
        id: PropTypes.string,
        category: PropTypes.string,
        coaccused: PropTypes.number,
        victims: PropTypes.arrayOf(
          PropTypes.shape({
            gender: PropTypes.string,
            race: PropTypes.string,
            age: PropTypes.number,
          })
        )
      })
    ),
    PropTypes.arrayOf(
      PropTypes.shape({
        point: PropTypes.shape({
          lat: PropTypes.number,
          lon: PropTypes.number
        }),
        kind: PropTypes.string,
        id: PropTypes.string,
        category: PropTypes.string,
      })
    ),
  ])
};

Map.defaultProps = {
  legend: {
    allegationCount: 0,
    sustainedCount: 0,
    useOfForceCount: 0
  },
  markers: []
};
