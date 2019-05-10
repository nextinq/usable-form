// @flow

import type { FormStateReducer } from '../types';
import { appendUniq } from '../utils/append-uniq';
import type { FormStateReducerActions } from './form-state-reducer-types.flow';

export const initialFormState: FormStateReducer = {
  touched: [],
  errors: [],
  isValid: true
};

const isValid = errors => !errors || errors.length === 0;

export function formStateReducer(
  state: FormStateReducer,
  action: FormStateReducerActions
): FormStateReducer {
  switch (action.type) {
    case 'field-touched': {
      const { fieldName } = action.payload;
      return { ...state, touched: appendUniq(fieldName, state.touched) };
    }
    case 'set-form-errors': {
      const { errors, touchFields } = action.payload;
      const touched = touchFields
        ? errors.map(err => err.source)
        : state.touched;
      return { ...state, errors, isValid: isValid(errors), touched };
    }
    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
}
