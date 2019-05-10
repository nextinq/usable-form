// @flow

import type { InputErrorProps, ValidationError } from './types';

export function getInputError(
  fieldName: string,
  errors: Array<ValidationError>
): ?ValidationError {
  if (!errors) {
    return null;
  }
  return errors.find(err => err.source === fieldName);
}

export function isInputTouched(
  fieldName: string,
  touched: Array<string>
): boolean {
  if (!touched) {
    return false;
  }
  return touched.includes(fieldName);
}

export function mapInputError(
  fieldName: string,
  errors: Array<ValidationError>
): InputErrorProps {
  const inputError = getInputError(fieldName, errors);
  return {
    source: inputError && inputError.source,
    code: inputError && inputError.code,
    severity: inputError && inputError.severity,
    message: inputError && inputError.message
  };
}
