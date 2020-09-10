import { ChangeEvent, FocusEvent, KeyboardEvent, SyntheticEvent } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ErrorSeverity = 'error' | 'warning' | string;

export type FormValue = string | object | number | boolean | undefined | null;

export type DispatchFn<TValues> = (action: FormValuesReducerActions<TValues>) => void;

export type ValidationError = {
  source: string;
  code: string;
  message?: string;
  severity?: ErrorSeverity;
};

export type FormStateReducer = {
  touched: Array<string>;
  errors: Array<ValidationError>;
  isValid: boolean;
};

export type FormState = FormStateReducer & {
  setFormErrors: (errors: Array<ValidationError>) => void;
  clearFormErrors: () => void;
  clearFieldError: (fieldName: string) => void;
  clearTouched: () => void;
};

export type SetupFieldResult = {
  value: any;
  onBlur: (
    e:
      | FocusEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
      | FocusEvent<HTMLElement>
      | KeyboardEvent<HTMLElement>
  ) => void;
  onChange: (
    e: ChangeEvent<HTMLInputElement> | SyntheticEvent<HTMLElement>,
    data: Partial<{
      value: FormValue | Array<FormValue> | null | undefined | any | string[];
    }>
  ) => void;
  id: string;
  name: string;
};

export type FormValuesActionSetFieldValue = {
  type: 'set-field-value';
  payload: {
    fieldName: string;
    value: any;
  };
};

export type FormValuesActionSetValues<TValues> = {
  type: 'set-values';
  payload: {
    values: TValues;
  };
};

export type FormValuesReducerActions<TValues> =
  | FormValuesActionSetFieldValue
  | FormValuesActionSetValues<TValues>;

export type FormStateActionFieldTouched = {
  type: 'field-touched';
  payload: {
    fieldName: string;
  };
};

export type FormStateActionSetFormErrors = {
  type: 'set-form-errors';
  payload: {
    errors: Array<ValidationError>;
    touchFields: boolean;
    replace?: boolean;
  };
};

export type FormStateActionClearFieldError = {
  type: 'clear-field-error';
  payload: {
    fieldName: string;
    touched?: boolean;
  };
};

export type FormStateActionClearFormErrors = {
  type: 'clear-form-errors';
};

export type FormStateActionClearTouched = {
  type: 'clear-touched';
};

export type FormStateReducerActions =
  | FormStateActionFieldTouched
  | FormStateActionSetFormErrors
  | FormStateActionClearFormErrors
  | FormStateActionClearFieldError
  | FormStateActionClearTouched;

export type SetupWrapperResult = {
  error?: ValidationError | null | undefined;
  touched?: boolean;
  locPrefix?: string;
  label?: string;
  locKey?: string;
};

export type InitUseFormOptions = {
  schemaValidator:
    | ((
        validationSchema: Record<string, any>,
        formValues: any,
        fieldName: string | null | undefined
      ) => Array<ValidationError>)
    | null;
};

export type UseFormOptions<TValues> = {
  initialValues?: TValues;
  clearErrorOnBlur?: boolean;
  validationSchema?: Record<string, any> | ((data: TValues) => Record<string, any>);
  validateForm?: (
    formValues: TValues,
    fieldName: string | null | undefined
  ) => Array<ValidationError>;
};

export type UseFormResult<TValues> = {
  setupField: (fieldName: string) => SetupFieldResult;
  setupWrapper: (fieldName: string, locPrefix?: string) => SetupWrapperResult;
  setFieldValue: (fieldName: string, value: any) => void;
  formValues: TValues;
  formState: FormState;
  setValues: (values: TValues) => void;
  validate: () => void;
};

export type ErrorMapperOptions = {
  /**
   * Source prefixes to be stripped from API error source
   */
  ignoredPrefixes?: Array<string>;
  /**
   * Error source map: (apiError -> formError)
   *
   * @example
   * {
   *   'client.name': 'firstName'
   * }
   * API error with source 'client.name' will be mapped to form error source 'firstName'
   *
   */
  errorSourceMap?: any;
  /**
   * Fields, which will be treated as base errors and will be displayed with error summary component only.
   **/
  nonFieldErrors?: Array<string>;
};
