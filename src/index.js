// @flow
// eslint-disable-next-line import/no-unresolved
import { useReducer, useEffect, useState, useCallback } from 'react';
import deepEqual from 'deep-equal';

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
import { getFieldInputValue, setupInput } from './utils/field-utils';

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
  const [prevInitialValues, setPrevInitialValues] = useState({
    ...initialValues
  });
  const [formState, dispatchFormState]: [
    FormStateReducer,
    DispatchFn
  ] = useReducer(formStateReducer, initialFormState);

  const runValidation = useCallback(
    (fieldName: ?string, values: FormValues) => {
      if (fieldName) {
        dispatchFormState({ type: 'field-touched', payload: { fieldName } });
      }
      const { validateForm, validationSchema } = opts;
      if (validateForm) {
        const errors = validateForm(values, fieldName);
        dispatchFormState({
          type: 'set-form-errors',
          payload: { errors: errors || [], touchFields: false }
        });
      }
      if (!validateForm && validationSchema && initOpts.schemaValidator) {
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
    },
    [opts.validateForm, opts.validationSchema, initOpts.schemaValidator]
  );

  const validateForm = useCallback(() => {
    runValidation(null, formValues);
  }, [formValues]);

  useEffect(() => {
    validateForm();
  }, []);

  useEffect(() => {
    if (!deepEqual(initialValues, prevInitialValues)) {
      dispatch({
        type: 'set-values',
        payload: {
          values: { ...formValues, ...initialValues }
        }
      });
      validateForm();
      setPrevInitialValues(initialValues);
    }
  }, [initialValues]);

  const setFieldValue = useCallback(
    (fieldName: string, value: string) => {
      dispatch({ type: 'set-field-value', payload: { fieldName, value } });
      const values = { ...formValues, [fieldName]: value };
      runValidation(fieldName, values);
    },
    [formValues]
  );

  const handleInputChange: any = useCallback(
    (fieldName: string) => (e: any, data: ?{ value: string }) => {
      const value = data ? data.value : e.currentTarget.value;
      setFieldValue(fieldName, value);
    },
    []
  );

  const handleInputBlur = useCallback(
    (fieldName: string) => {
      runValidation(fieldName, formValues);
    },
    [formValues]
  );

  const setupField = useCallback(
    (fieldName: string) => {
      return {
        value: getFieldInputValue(fieldName, formValues),
        ...setupInput(fieldName),
        onChange: handleInputChange(fieldName),
        onBlur: () => handleInputBlur(fieldName)
      };
    },
    [formValues]
  );
  const setupWrapper = useCallback(
    (fieldName: string, locPrefix?: string) => {
      return {
        error: getInputError(fieldName, formState.errors),
        touched: isInputTouched(fieldName, formState.touched),
        locPrefix,
        label: fieldName
      };
    },
    [formState.errors, formState.touched]
  );

  const setFormErrors = useCallback((errors: Array<ValidationError>) => {
    dispatchFormState({
      type: 'set-form-errors',
      payload: { errors: errors || [], touchFields: true }
    });
  }, []);

  const setValues = useCallback((values: Object) => {
    const finalValues = { ...(formValues || {}), ...(values || {}) };
    dispatch({ type: 'set-values', payload: { values: finalValues } });
  }, []);

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
