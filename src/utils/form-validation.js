// @flow

import type { ValidationError } from '../types';

export function getInputError(
  fieldName: string,
  errors: Array<ValidationError>
): ?ValidationError {
  if (!errors) {
    return null;
  }
  const result = errors.find(err => err.source === fieldName);
  return result || null;
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
