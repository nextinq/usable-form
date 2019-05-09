// @flow

import type { ValidationError } from './types.flow';

export type FormStateActionFormValidated = {
  type: 'form-validated',
  payload: {
    errors: Array<ValidationError>
  }
};

export type FormStateActionFieldTouched = {
  type: 'field-touched',
  payload: {
    fieldName: string
  }
};

export type FormStateActionSetFormErrors = {
  type: 'set-form-errors',
  payload: {
    errors: Array<ValidationError>
  }
};

export type FormStateReducerActions =
  | FormStateActionFormValidated
  | FormStateActionFieldTouched
  | FormStateActionSetFormErrors;
