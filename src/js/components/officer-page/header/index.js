import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { map } from 'lodash';

import ResponsiveFluidWidthComponent from 'components/responsive/responsive-fluid-width-component';
import {
  officerNameStyle, linkWrapperStyle, linkStyle, wrapperStyle, activeLinkStyle, boxShadowStyle
} from './header.style';


export const officerPath = subPath => pathname => {
  if (subPath) {
    return pathname.replace(/(\d+).+/, `$1/${subPath}/`);
  }
  return pathname.replace(/(\d+).+/, '$1/');
};

const OFFICER_BUTTONS = [
  ['Summary', officerPath()],
  ['Timeline', officerPath('timeline')],
  ['Social Map', officerPath('social')]
];


export default class Header extends Component {
  render() {
    const { officerName, pathname, officerTimelineUrlParams } = this.props;

    return (
      <div style={ boxShadowStyle }>
        <ResponsiveFluidWidthComponent>
          <div style={ wrapperStyle }>
            <div className='test--officer-name' style={ officerNameStyle }>{ officerName }</div>
            <div style={ linkWrapperStyle }>
              {
                map(OFFICER_BUTTONS, ([label, getPath], ind) => {
                  const path = getPath(pathname);
                  let pathWithParams = (label === 'Timeline' && officerTimelineUrlParams) ?
                    path + officerTimelineUrlParams : path;
                  return (
                    <Link to={ pathWithParams } key={ ind }
                      className={ path === pathname ? 'test--header-button-active' : 'test--header-button' }
                      style={ path === pathname ? activeLinkStyle : linkStyle }>
                      { label }
                    </Link>
                  );
                })
              }
            </div>
          </div>
        </ResponsiveFluidWidthComponent>
      </div>
    );
  }
}

Header.propTypes = {
  officerName: PropTypes.string,
  pathname: PropTypes.string,
  officerTimelineUrlParams: PropTypes.string
};
