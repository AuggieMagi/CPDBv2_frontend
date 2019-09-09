import React, { PropTypes, Component } from 'react';

import { calculatePosition } from 'utils/dom';
import SlimHeaderContent from './slim-header-content';


export class SlimHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 'top',
    };

    this.recalculatePosition = this.recalculatePosition.bind(this);
  }

  componentDidMount() {
    addEventListener('scroll', this.recalculatePosition);
  }

  componentWillUnmount() {
    removeEventListener('scroll', this.recalculatePosition);
  }

  recalculatePosition() {
    // offset must equal the height of top bar so that the navbar is always visible
    const newPosition = calculatePosition(88);
    if (newPosition !== this.state.position) {
      this.setState({ position: newPosition });
    }
  }

  render() {
    const { show, pathname } = this.props;
    const { editModeOn } = this.context;
    const { position } = this.state;

    if (!show) {
      return null;
    }

    return (
      <SlimHeaderContent
        position={ position }
        pathname={ pathname }
        editModeOn={ editModeOn }
      />
    );
  }
}

SlimHeader.propTypes = {
  show: PropTypes.bool,
  pathname: PropTypes.string,
};

SlimHeader.defaultProps = {
  show: true,
};

SlimHeader.contextTypes = {
  editModeOn: PropTypes.bool,
};

export default SlimHeader;
