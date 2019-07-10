import React, { Component, PropTypes } from 'react';


const MIN_TEXTAREA_ROWS = 2;

export default class AutosaveTextareaInput extends Component {
  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      currentValue: props.value
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.adjustTextareaHeight(this.textarea);
  }

  adjustTextareaHeight(textarea) {
    const { textareaLineHeight } = this.props;
    textarea.rows = MIN_TEXTAREA_ROWS;
    textarea.rows = Math.floor(textarea.scrollHeight / textareaLineHeight);
  }

  handleBlur() {
    const { save, fieldType, value } = this.props;
    const { currentValue } = this.state;

    if (save && currentValue !== value) {
      save({ attr: fieldType, value: currentValue });
    }
  }

  handleChange(event) {
    this.adjustTextareaHeight(event.target);
    this.setState({ currentValue: event.target.value });
  }

  handleResize() {
    this.textarea && this.adjustTextareaHeight(this.textarea);
  }

  render() {
    const { currentValue } = this.state;
    const { className, placeholder } = this.props;

    return (
      <textarea
        ref={ el => this.textarea = el }
        value={ currentValue }
        onBlur={ this.handleBlur }
        onChange={ this.handleChange }
        className={ className }
        placeholder={ placeholder }
      />
    );
  }
}

AutosaveTextareaInput.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  save: PropTypes.func,
  fieldType: PropTypes.string.isRequired,
  textareaLineHeight: PropTypes.number.isRequired
};