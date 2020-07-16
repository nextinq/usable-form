import getFromPath from 'lodash.get';
import setFromPath from 'lodash.set';

export const getFieldParts = (name: string): Array<string> => (name ? name.split('.') : [name]);

export const getFieldInputName = (name: string): string => getFieldParts(name).join('__');

export const setupInput = (fieldName: string): { id: string; name: string } => {
  return {
    id: getFieldInputName(fieldName),
    name: getFieldInputName(fieldName)
  };
};

export function getFieldInputValue<TValues>(
  fieldName: string,
  formValues: TValues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return getFromPath(formValues, fieldName, undefined);
}

export function setFieldInputValue<TValues>(
  fieldName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  formValues: TValues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return setFromPath((formValues as unknown) as object, fieldName, value);
}
