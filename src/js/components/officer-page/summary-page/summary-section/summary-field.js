import React, { Component, PropTypes } from 'react';

import { wrapperStyle, labelStyle, valueStyle, extraInfoStyle } from './summary-field.style';


export default class SummaryField extends Component {
  render() {
    const { label, value, style, children } = this.props;

    return (
      <div style={ { ...wrapperStyle, ...style } }>
        <span className='test--field-label' style={ labelStyle }>{ label }</span>
        <span className='test--field-value' style={ valueStyle }>{ value }</span>
        <span className='test--field-extra-info' style={ extraInfoStyle }> { children } </span>
      </div>
    );
  }
}

SummaryField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
  children: PropTypes.node,
};
