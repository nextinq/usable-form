import { useReducer, useEffect, useState, useCallback } from 'react';
import deepEqual from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';

import { getInputError, isInputTouched } from './utils/form-validation';
import { formValuesReducer } from './reducers/form-values-reducer';

import { formStateReducer, initialFormState } from './reducers/form-state-reducer';

import {
  InitUseFormOptions,
  UseFormOptions,
  ValidationError,
  UseFormResult,
  DispatchFn
} from './types';
import { getFieldInputValue, setupInput } from './utils/field-utils';

export * from './types';

export { saveRestApiForm } from './save-rest-api-form';

const initOpts: InitUseFormOptions = {
  schemaValidator: null
};

export function initUseForm(options: InitUseFormOptions): void {
  initOpts.schemaValidator = options && options.schemaValidator;
}

export function useForm<TValues>(options: UseFormOptions<TValues>): UseFormResult<TValues> {
  const opts = options || {};
  const originalInitialValues = opts.initialValues || {};
  const initialValues =
    originalInitialValues instanceof Object
      ? cloneDeep(originalInitialValues)
      : originalInitialValues;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [formValues, dispatch]: [TValues, DispatchFn<TValues>] = useReducer(
    formValuesReducer,
    initialValues
  );
  const [prevInitialValues, setPrevInitialValues] = useState({
    ...initialValues
  });
  const [formState, dispatchFormState] = useReducer(formStateReducer, initialFormState);

  const setTouched = useCallback(
    (fieldName: string | null | undefined) => {
      if (fieldName) {
        dispatchFormState({ type: 'field-touched', payload: { fieldName } });
      }
    },
    [
      opts.validateForm,
      opts.validationSchema,
      initOpts.schemaValidator,
      formValues,
      formState.touched
    ]
  );

  const clearTouched = useCallback(() => {
    dispatchFormState({ type: 'clear-touched' });
  }, []);

  useEffect(() => {
    const { validateForm, validationSchema } = opts;
    if (validateForm) {
      const errors = validateForm(formValues, null);
      dispatchFormState({
        type: 'set-form-errors',
        payload: { errors: errors || [], touchFields: false }
      });
    }
    if (!validateForm && validationSchema && initOpts.schemaValidator) {
      const errors = initOpts.schemaValidator(validationSchema, formValues, null);
      dispatchFormState({
        type: 'set-form-errors',
        payload: { errors: errors || [], touchFields: false }
      });
    }
  }, [formValues]);

  const validateForm = useCallback(() => {
    clearTouched();
  }, [formValues]);

  useEffect(() => {
    if (!deepEqual(initialValues, prevInitialValues)) {
      dispatch({
        type: 'set-values',
        payload: {
          values: { ...formValues, ...initialValues }
        }
      });
      clearTouched();
      setPrevInitialValues(initialValues);
    }
  }, [originalInitialValues]);

  const setFieldValue = useCallback(
    (fieldName: string, value: string) => {
      dispatch({ type: 'set-field-value', payload: { fieldName, value } });
      setTouched(fieldName);
    },
    [formValues]
  );

  const clearFieldError = useCallback((fieldName: string, touched = false) => {
    dispatchFormState({
      type: 'clear-field-error',
      payload: {
        fieldName,
        touched
      }
    });
  }, []);

  const handleInputChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fieldName: string) => (e: any, data: any): void => {
      const value = data ? data.value : e.currentTarget.value;
      setFieldValue(fieldName, value);
    },
    []
  );

  const handleInputBlur = useCallback(
    (fieldName: string) => {
      clearFieldError(fieldName);
      setTouched(fieldName);
    },
    [formValues]
  );

  const setupField = useCallback(
    (fieldName: string) => {
      const error = getInputError(fieldName, formState.errors);
      const touched = isInputTouched(fieldName, formState.touched);
      return {
        value: getFieldInputValue(fieldName, formValues),
        ...setupInput(fieldName),
        onChange: handleInputChange(fieldName),
        onBlur: (): void => handleInputBlur(fieldName),
        severity: error && touched ? error.severity || 'error' : null
      };
    },
    [formValues, formState.errors, formState.touched]
  );
  const setupWrapper = useCallback(
    (fieldName: string, locPrefix?: string) => {
      return {
        error: getInputError(fieldName, formState.errors),
        touched: isInputTouched(fieldName, formState.touched),
        locPrefix,
        locKey: fieldName,
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

  const clearFormErrors = useCallback(() => {
    dispatchFormState({
      type: 'clear-form-errors'
    });
  }, []);

  const setValues = useCallback((values: TValues) => {
    const finalValues = { ...(formValues || {}), ...(values || {}) };
    dispatch({
      type: 'set-values',
      payload: { values: finalValues as TValues }
    });
  }, []);

  return {
    setupField,
    setupWrapper,
    formValues,
    setValues,
    setFieldValue,
    formState: {
      ...formState,
      setFormErrors,
      clearFormErrors,
      clearFieldError,
      clearTouched
    }
  };
}
