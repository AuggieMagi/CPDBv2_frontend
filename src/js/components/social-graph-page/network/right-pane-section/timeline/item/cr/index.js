import React, { Component, PropTypes } from 'react';

import Attachments from './attachments';
import styles from './cr.sass';


export default class Cr extends Component {
  render() {
    const { item, pathname, onTrackingAttachment } = this.props;

    return (
      <div className={ styles.wrapper }>
        <div className='content'>
          <span className={ 'kind' }>C</span>
          <span className='detail'>
            <div className='category'>{ item.category }</div>
            <div className='subcategory'>{ item.subcategory }</div>
          </span>
          <span className='right'>
            <Attachments
              attachments={ item.attachments }
              pathname={ pathname }
              onTrackingAttachment={ onTrackingAttachment }
            />
            <span className='date'>{ item.incidentDate }</span>
          </span>
        </div>
      </div>
    );
  }
}

Cr.propTypes = {
  item: PropTypes.object,
  pathname: PropTypes.string,
  onTrackingAttachment: PropTypes.func,
};
