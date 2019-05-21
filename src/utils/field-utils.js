// @flow
import getFromPath from 'lodash.get';
import setFromPath from 'lodash.set';
import type { FormValues } from '../types';

export const getFieldParts = (name: string): Array<string> =>
  name ? name.split('.') : [name];

export const getFieldInputName = (name: string) =>
  getFieldParts(name).join('__');

export const setupInput = (fieldName: string) => {
  return {
    id: getFieldInputName(fieldName),
    name: getFieldInputName(fieldName)
  };
};

export function getFieldInputValue(fieldName: string, formValues: FormValues) {
  return getFromPath(formValues, fieldName, null);
}

export function setFieldInputValue(
  fieldName: string,
  value: any,
  formValues: FormValues
) {
  return setFromPath(formValues, fieldName, value);
}
