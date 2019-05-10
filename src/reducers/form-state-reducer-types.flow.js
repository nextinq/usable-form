// @flow

import type { ValidationError } from '../types';

export type FormStateActionFieldTouched = {
  type: 'field-touched',
  payload: {
    fieldName: string
  }
};

export type FormStateActionSetFormErrors = {
  type: 'set-form-errors',
  payload: {
    errors: Array<ValidationError>,
    touchFields: boolean
  }
};

export type FormStateReducerActions =
  | FormStateActionFieldTouched
  | FormStateActionSetFormErrors;
