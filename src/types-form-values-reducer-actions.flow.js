// @flow

import type { FormValues } from './types.flow';

export type FormValuesActionSetFieldValue = {
  type: 'set-field-value',
  payload: {
    fieldName: string,
    value: mixed
  }
};

export type FormValuesActionSetValues = {
  type: 'set-values',
  payload: {
    values: FormValues
  }
};

export type FormValuesReducerActions =
  | FormValuesActionSetFieldValue
  | FormValuesActionSetValues;
