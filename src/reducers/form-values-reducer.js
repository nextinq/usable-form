// @flow

import type { FormValues } from '../types';
import type { FormValuesReducerActions } from './form-values-reducer-types.flow';
import { setFieldInputValue } from '../utils/field-utils';

export function formValuesReducer(
  state: FormValues,
  action: FormValuesReducerActions
): FormValues {
  switch (action.type) {
    case 'set-field-value': {
      const { fieldName, value } = action.payload;
      return { ...setFieldInputValue(fieldName, value, state) };
    }
    case 'set-values': {
      const { values } = action.payload;
      return { ...state, ...values };
    }
    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
}
