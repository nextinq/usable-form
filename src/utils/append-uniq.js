// @flow

export function appendUniq<TValue: mixed>(
  value: TValue,
  array: Array<TValue>
): Array<TValue> {
  return Array.from(new Set([...array, value]));
}
