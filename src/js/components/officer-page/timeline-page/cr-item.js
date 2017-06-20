import React, { PropTypes, Component } from 'react';

import Hoverable from 'components/common/higher-order/hoverable';
import {
  crTextStyle, crNumberStyle, dateStyle, categoryStyle, findingStyle, subcategoryStyle, coaccusedStyle,
  documentIconStyle, audioIconStyle, wrapperStyle
} from './cr-item.style';


export class CRItem extends Component {
  render() {
    const { hovering, item, flashRatio, onClick } = this.props;
    const { crid, date, category, finding, subcategory, coaccused, hasDocument, hasAudio } = item;
    return (
      <div style={ wrapperStyle } onClick={ () => onClick(crid) }>
        <div>
          <span className='test--cr-item-crid' style={ crTextStyle }>
            CR <span style={ crNumberStyle }>{ crid }</span>
          </span>
          <span className='test--cr-item-date' style={ dateStyle }>{ date }</span>
        </div>
        <div className='test--cr-item-category' style={ categoryStyle(hovering, flashRatio) } >
          { category }
        </div>
        <div className='test--cr-item-subcategory' style={ subcategoryStyle(hovering) }>{ subcategory }</div>
        <div>
          <span className='test--cr-item-finding' style={ findingStyle }>{ finding }</span>
        </div>
        <div>
          <span className='test--cr-item-coaccused' style={ coaccusedStyle }>1 of { coaccused } Coaccused</span>
          { hasDocument ? <span className='test--document-icon' style={ documentIconStyle }/> : null }
          { hasAudio ? <span className='test--audio-icon' style={ audioIconStyle }/> : null }
        </div>
      </div>
    );
  }
}

CRItem.propTypes = {
  hovering: PropTypes.bool,
  item: PropTypes.object,
  flashRatio: PropTypes.number,
  onClick: PropTypes.func
};

CRItem.defaultProps = {
  item: {}
};

export default Hoverable(CRItem);