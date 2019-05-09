// @flow

import type { FormStateReducer } from '../types.flow';
import { appendUniq } from '../utils/append-uniq';
import type { FormStateReducerActions } from '../types-form-state-reducer-actions.flow';

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
    case 'form-validated': {
      const { errors } = action.payload;
      return { ...state, isValid: isValid(errors), errors };
    }
    case 'field-touched': {
      const { fieldName } = action.payload;
      return { ...state, touched: appendUniq(fieldName, state.touched) };
    }
    case 'set-form-errors': {
      const { errors } = action.payload;
      const touched = errors.map(err => err.source);
      return { ...state, errors, isValid: isValid(errors), touched };
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
}
