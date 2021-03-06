import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import styles from './view-map-button.sass';


function ViewMapButton(props) {
  const { lat, lng, zoom } = props;
  const url = `http://maps.google.com/maps?&z=${zoom}&q=${lat}+${lng}&ll=${lat}+${lng}`;

  return (
    <a
      className={ cx(styles.viewMapButton, 'no-print', 'test--view-map-button') }
      href={ url } target='_blank'
    >
      View on google maps
      <div className='view-map-button-arrow' />
    </a>
  );
}

ViewMapButton.propTypes = {
  lng: PropTypes.number,
  lat: PropTypes.number,
  zoom: PropTypes.number,
};

ViewMapButton.defaultProps = {
  zoom: 10,
};

export default ViewMapButton;
