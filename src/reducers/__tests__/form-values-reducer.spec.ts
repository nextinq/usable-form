// @ts-nocheck

import { formValuesReducer as reducer } from '../form-values-reducer';

describe('formValuesReducer', () => {
  it('should set field value', () => {
    const nextState = reducer(
      {},
      {
        type: 'set-field-value',
        payload: { fieldName: 'field', value: 'val' }
      }
    );
    expect(nextState).toMatchObject({
      field: 'val'
    });
  });

  it('should set form values', () => {
    const values = {
      field1: 'value1',
      field2: 'value2'
    };
    const nextState = reducer(
      {},
      {
        type: 'set-values',
        payload: { values }
      }
    );
    expect(nextState).toMatchObject(values);
  });
});
