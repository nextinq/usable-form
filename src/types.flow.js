// @flow
export type ErrorSeverity = 'Error' | 'Warning';

export type DispatchFn = Object => void;

export type InputErrorProps = {
  source: ?string,
  code: ?string,
  message: ?string,
  severity: ?ErrorSeverity
};

export type ValidationError = {
  source: string,
  code: string,
  message?: string,
  severity: ErrorSeverity
};

export type FormStateReducer = {
  touched: Array<string>,
  errors: Array<ValidationError>,
  isValid: boolean
};

export type FormValues = {
  [string]: mixed
};

export type FormState = FormStateReducer & {
  setFormErrors: (errors: Array<ValidationError>) => void
};

export type SetupFieldResult = {
  value: mixed,
  onChange: (e: { target: { value: mixed } }, data?: { value: mixed }) => void,
  id: string,
  name: string
};

export type SetupWrapperResult = {
  error?: ValidationError,
  touched?: boolean,
  locPrefix?: string,
  label: string
};

export type InitUseFormOptions = {
  schemaValidator: ?(
    validationSchema: Object,
    formValues: FormValues,
    fieldName: string
  ) => Array<ValidationError>
};

export type UseFormOptions = {
  initialValues: FormValues,
  validationSchema: Object,
  validateForm: (
    formValues: FormValues,
    fieldName: string
  ) => Array<ValidationError>
};

export type UseFormResult = {
  setupField: (fieldName: string) => SetupFieldResult,
  setupWrapper: (fieldName: string, locPrefix?: string) => SetupWrapperResult,
  setFieldValue: (fieldName: string, value: mixed) => void,
  formValues: FormValues,
  formState: FormState,
  setValues: (values: Object) => void
};
