// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function appendUniq<TValue = any>(value: TValue, array: Array<TValue>): Array<TValue> {
  return Array.from(new Set([...array, value]));
}
