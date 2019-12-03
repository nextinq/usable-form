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
      return { ...state, errors, isValid: isValid(errors), touched };
    }
  }
}
