import React, { PropTypes, Component } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import { defaultConfig } from 'utils/spring-presets';


export default class RouteTransition extends Component {
  willEnter() {
    return {
      opacity: 0,
      scale: 0.95
    };
  }

  willLeave(key, value) {
    return {
      opacity: spring(0, defaultConfig()),
      scale: spring(0.95, defaultConfig())
    };
  }

  getStyles() {
    const { children, pathname } = this.props;

    return [
      {
        key: pathname,
        data: {
          handler: children
        },
        style: {
          opacity: spring(1, defaultConfig()),
          scale: spring(1, defaultConfig())
        }
      }
    ];
  }

  render() {
    return (
      <TransitionMotion
        styles={ this.getStyles() }
        willEnter={ this.willEnter }
        willLeave={ this.willLeave }
      >
        { interpolated =>
          <div>
            { interpolated.map(config => {
              const { key, style, data } = config;
              return (
                <div
                  key={ `${key}-transition` }
                  style={ {
                    opacity: style.opacity,
                    transform: `scale(${style.scale})`
                  } }
                >
                 { data.handler }
                </div>
              );
            }) }
          </div>
        }
      </TransitionMotion>
    );
  }
}

RouteTransition.propTypes = {
  pathname: PropTypes.string.isRequired,
  children: PropTypes.node
};
