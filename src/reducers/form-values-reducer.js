// @flow

import type { FormValues } from '../types';
import type { FormValuesReducerActions } from './form-values-reducer-types.flow';

export function formValuesReducer(
  state: FormValues,
  action: FormValuesReducerActions
): FormValues {
  switch (action.type) {
    case 'set-field-value': {
      const { fieldName, value } = action.payload;
      return { ...state, [fieldName]: value };
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
