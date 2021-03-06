import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { map, values, mapValues, isEqual } from 'lodash';
import { convertToRaw } from 'draft-js';

import { wrapperStyle } from './editable-section.style';
import { convertContentStateToEditorState } from 'utils/draft';
import { officersToSnakeCase, officersToCamelCase } from 'utils/case-converting-tranform';
import { SectionEditModeContext } from 'contexts';


export default function (SubComponent) {
  class EditableSection extends Component {
    static deserializeField(field) {
      if (!field) {
        return field;
      }

      switch (field.type) {
        case 'rich_text':
          return {
            ...field,
            value: convertContentStateToEditorState(field.value),
          };
        case 'officers_list':
          return {
            ...field,
            value: officersToCamelCase(field.value),
          };
      }
      return field;
    }

    constructor(props) {
      super(props);
      this.state = {
        fields: mapValues(props.fields, EditableSection.deserializeField),
        prevFields: props.fields,
        prevSectionEditModeOn: props.sectionEditModeOn,
      };
    }

    static getDerivedStateFromProps(props, state) {
      if (!isEqual(props.fields, state.prevFields) || props.sectionEditModeOn !== state.prevSectionEditModeOn)
        return {
          fields: mapValues(props.fields, EditableSection.deserializeField),
          prevFields: props.fields,
          prevSectionEditModeOn: props.sectionEditModeOn,
        };
      return null;
    }
    serializeField(field) {
      switch (field.type) {
        case 'rich_text':
          return {
            ...field,
            value: convertToRaw(field.value.getCurrentContent()),
          };
        case 'officers_list':
          return {
            ...field,
            value: officersToSnakeCase(field.value),
          };
      }
      return field;
    }

    handleSaveForm = () => {
      const data = map(values(this.state.fields), this.serializeField);
      this.props.onSaveForm({ fields: data })
        .then(() => this.props.turnOffSectionEditMode());
    };

    handleUpdateFieldValue = (fieldName, fieldValue) => {
      const { fields } = this.state;
      const field = fields[fieldName];

      this.setState({
        fields: {
          ...fields,
          [fieldName]: {
            ...field,
            value: fieldValue,
          },
        },
      });
    };

    fieldProps = (field, fieldName) => {
      const { sectionEditModeOn } = this.props;
      return {
        value: field && field.value,
        editModeOn: sectionEditModeOn,
        onChange: val => this.handleUpdateFieldValue(fieldName, val),
      };
    };

    render() {
      const {
        sectionEditModeOn, turnOnSectionEditMode, turnOffSectionEditMode,
        ...restProps
      } = this.props;
      const { fields } = this.state;

      return (
        <SectionEditModeContext.Provider value={ { sectionEditModeOn } }>
          <div style={ wrapperStyle(sectionEditModeOn) }>
            <SubComponent
              sectionEditModeOn={ sectionEditModeOn }
              editToggleProps={ {
                sectionEditModeOn,
                turnOnSectionEditMode,
                turnOffSectionEditMode,
                onSaveForm: this.handleSaveForm,
              } }
              fieldProps={
                mapValues(fields, this.fieldProps)
              }
              { ...restProps }/>
          </div>
        </SectionEditModeContext.Provider>
      );
    }
  }

  EditableSection.propTypes = {
    fields: PropTypes.object,
    onSaveForm: PropTypes.func,
    sectionEditModeOn: PropTypes.bool,
    turnOnSectionEditMode: PropTypes.func,
    turnOffSectionEditMode: PropTypes.func,
  };

  return EditableSection;
}
