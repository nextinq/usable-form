import { FormStateReducer, FormStateReducerActions, ValidationError } from '../types';
import { appendUniq } from '../utils/append-uniq';

export const initialFormState: FormStateReducer = {
  touched: [],
  errors: [],
  isValid: true
};

const isValid = (errors: Array<ValidationError>): boolean => !errors || errors.length === 0;

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
      const touched = touchFields ? errors.map((err) => err.source) : state.touched;
      const newErrors = errors.reduce<Array<ValidationError>>(
        (acc, err) => {
          const stateErrorIdx = state.errors.findIndex((e) => err.source === e.source);
          if (stateErrorIdx !== -1) {
            acc.splice(stateErrorIdx, 1, { ...state.errors[stateErrorIdx], ...err });
          } else {
            acc.push(err);
          }
          return acc;
        },
        [...state.errors]
      );

      const newTouched = new Set([...state.touched, ...touched]);
      return {
        ...state,
        errors: newErrors,
        isValid: isValid(errors),
        touched: Array.from(newTouched)
      };
    }
    case 'clear-form-errors': {
      return { ...state, errors: [], isValid: true };
    }
    case 'clear-field-error': {
      const newErrors = state.errors.filter((err) => err.source !== action.payload.fieldName);
      return { ...state, errors: newErrors, isValid: true };
    }
  }
}
