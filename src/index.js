// @flow
// eslint-disable-next-line import/no-unresolved
import { useReducer } from 'react';

import { getInputError, isInputTouched } from './utils/form-validation';
import { formValuesReducer } from './reducers/form-values-reducer';

import {
  formStateReducer,
  initialFormState
} from './reducers/form-state-reducer';

import type {
  DispatchFn,
  FormStateReducer,
  FormValues,
  InitUseFormOptions,
  UseFormOptions,
  ValidationError
} from './types';

export type {
  UseFormResult,
  UseFormOptions,
  InitUseFormOptions,
  FormValues,
  FormState
} from './types';

const initOpts: InitUseFormOptions = {
  schemaValidator: null
};

const setupInput = (fieldName, formName = null) => {
  if (formName) {
    return { id: `${formName}__${fieldName}`, name: fieldName };
  }
  return { id: fieldName, name: fieldName };
};

export function initUseForm(options: InitUseFormOptions) {
  initOpts.schemaValidator = options && options.schemaValidator;
}

export function useForm(options: UseFormOptions) {
  const opts = options || {};
  const initialValues = opts.initialValues || {};
  const [formValues, dispatch]: [FormValues, DispatchFn] = useReducer(
    formValuesReducer,
    initialValues
  );
  const [formState, dispatchFormState]: [
    FormStateReducer,
    DispatchFn
  ] = useReducer(formStateReducer, initialFormState);

  const runValidation = (fieldName, values: FormValues) => {
    dispatchFormState({ type: 'field-touched', payload: { fieldName } });
    const { validateForm, validationSchema } = opts;
    if (validateForm) {
      const errors = validateForm(values, fieldName);
      dispatchFormState({
        type: 'set-form-errors',
        payload: { errors: errors || [], touchFields: false }
      });
    }
    if (validationSchema && initOpts.schemaValidator) {
      const errors = initOpts.schemaValidator(
        validationSchema,
        values,
        fieldName
      );
      dispatchFormState({
        type: 'set-form-errors',
        payload: { errors: errors || [], touchFields: false }
      });
    }
  };

  const setFieldValue = (fieldName: string, value: string) => {
    dispatch({ type: 'set-field-value', payload: { fieldName, value } });
    const values = { ...formValues, [fieldName]: value };
    runValidation(fieldName, values);
  };

  const handleInputChange: any = (fieldName: string) => (
    e: any,
    data: ?{ value: string }
  ) => {
    const value = data ? data.value : e.currentTarget.value;
    setFieldValue(fieldName, value);
  };

  const handleInputBlur = (fieldName: string) => {
    runValidation(fieldName, formValues);
  };

  const setupField = (fieldName: string) => {
    return {
      value: formValues[fieldName] || '',
      ...setupInput(fieldName, null),
      onChange: handleInputChange(fieldName),
      onBlur: () => handleInputBlur(fieldName)
    };
  };
  const setupWrapper = (fieldName: string, locPrefix?: string) => {
    return {
      error: getInputError(fieldName, formState.errors),
      touched: isInputTouched(fieldName, formState.touched),
      locPrefix,
      label: fieldName
    };
  };

  const setFormErrors = (errors: Array<ValidationError>) => {
    dispatchFormState({
      type: 'set-form-errors',
      payload: { errors: errors || [], touchFields: true }
    });
  };

  const setValues = (values: Object) => {
    dispatch({ type: 'set-values', payload: { values } });
  };

  return {
    setupField,
    setupWrapper,
    formValues,
    setValues,
    setFieldValue,
    formState: {
      ...formState,
      setFormErrors
    }
  };
}
