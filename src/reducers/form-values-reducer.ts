import { FormValuesReducerActions } from '../types';
import { setFieldInputValue } from '../utils/field-utils';

export function formValuesReducer<TValues>(
  state: TValues,
  action: FormValuesReducerActions<TValues>
): TValues {
  switch (action.type) {
    case 'set-field-value': {
      const { fieldName, value } = action.payload;
      return { ...setFieldInputValue(fieldName, value, state) };
    }
    case 'set-values': {
      const { values } = action.payload;
      return { ...state, ...values };
    }
  }
}
