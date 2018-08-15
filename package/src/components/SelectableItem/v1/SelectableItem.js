import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash.uniqueid";
import styled from "styled-components";
import { applyTheme } from "../../../utils";

const StyledItem = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${applyTheme("selectableListHeight")};
  @media (max-width: 768px) {
    height: ${applyTheme("selectableListHeightMobile")};
  }
  input {
    cursor: pointer;
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    visibility: visible;
    white-space: nowrap;
  }
  input:checked + label span::before {
    content: " ";
    display: inline-block;
    position: relative;
    width: ${applyTheme("selectableItemRadioButtonCheckSize")};
    height: ${applyTheme("selectableItemRadioButtonCheckSize")};
    border-radius: 50%;
    background-color: ${applyTheme("selectableItemRadioButtonColor")};
  }
  input:focus + label span {
    box-shadow: 0 0 0 2px #8ce0c9;
    outline: 1px solid transparent;
  }
  label {
    font-family: ${applyTheme("selectableItemLabelFontFamily")};
    color: ${applyTheme("selectableItemLabelColor")};
    font-size: ${applyTheme("selectableItemLabelFontSize")};
    letter-spacing: ${applyTheme("selectableItemLabelLetterSpacing")};
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-color: ${applyTheme("selectableItemRadioButtonBackgroundColor")};
    border: ${applyTheme("selectableItemRadioButtonBorder")};
    height: ${applyTheme("selectableItemRadioButtonSize")};
    width: ${applyTheme("selectableItemRadioButtonSize")};
    margin: ${applyTheme("selectableItemRadioButtonMargin")};
    border-radius: 50%;
    box-sizing: border-box;
  }
  .detail {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${applyTheme("selectableItemLabelFontFamily")};
    font-size: 16px;
    letter-spacing: ${applyTheme("selectableItemLabelLetterSpacing")};
  }
`;

class SelectableItem extends Component {
  static propTypes = {
    /**
     * Item data
     */
    item: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      /**
       * Label
       */
      label: PropTypes.string.isRequired,
      /**
       * Optional text, SVG or element displayed on the right-hand side
       */
      detail: PropTypes.node,
      /**
       * Custom class name
       */
      className: PropTypes.string
    }),
    /**
     * Name for input
     */
    name: PropTypes.string,
    /**
     * On change handler for input
     */
    onChange: PropTypes.func,
    /**
     * On change handler for input
     */
    onChanging: PropTypes.func,
    /**
     * True for a checked item, undefined for an unchecked item
     */
    value: PropTypes.bool // eslint-disable-line react/boolean-prop-naming
  }

  static defaultProps = {
    className: undefined,
    name: undefined,
    onChange() { },
    onChanging() { },
    value: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      id: uniqueId("Radio_"),
      value: props.value || false
    };
  }

  componentWillMount() {
    this.handleChange(this.props.value || false);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { value: nextValue } = nextProps;

    // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
    if (value !== nextValue) {
      this.setState({ value: nextValue || false });
      this.handleChange(nextValue || false);
    }
  }

  onChange = (event) => {
    this.setValue(event.target.checked);
  };

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ value });
    this.handleChange(value);
  }

  resetValue() {
    this.setValue(this.props.value || false);
  }

  handleChange(checked) {
    if (this.lastValue === checked) return;
    this.lastValue = checked;
    const { onChanging, onChange } = this.props;
    onChanging(checked);
    onChange(checked);
  }

  // Input is dirty if value prop doesn't match value state. Whenever a changed
  // value prop comes in, we reset state to that, thus becoming clean.
  isDirty() {
    return this.state.value !== this.props.value;
  }

  render() {
    const {
      name,
      item: {
        _id,
        className,
        label,
        detail
      }
    } = this.props;
    const { value } = this.state;

    return (
      <StyledItem className={className} >
        <input
          checked={value === true}
          id={_id}
          onChange={this.onChange}
          type="radio"
          name={name}
        />
        <label
          htmlFor={_id}
        >
          <span />
          {label}
        </label>
        {detail ? <div className="detail">{detail}</div> : null}
      </StyledItem >
    );
  }
}

export default SelectableItem;
