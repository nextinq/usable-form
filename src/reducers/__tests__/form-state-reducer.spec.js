import {
  initialFormState as initialState,
  formStateReducer as reducer
} from '../form-state-reducer';

describe('formStateReducer', () => {
  it('should set field touched', () => {
    const nextState = reducer(initialState, {
      type: 'field-touched',
      payload: { fieldName: 'field1' }
    });
    expect(nextState.touched).toContain('field1');
  });

  it('should set form errors and touch erroneous fields', () => {
    const errors = [
      { code: 'required', source: 'firstName', severity: 'Error' }
    ];
    const nextState = reducer(initialState, {
      type: 'set-form-errors',
      payload: { errors, touchFields: true }
    });
    expect(nextState).toMatchObject({
      isValid: false,
      errors,
      touched: [errors[0].source]
    });
  });

  it('should set form-errors without touching erroneous fields', () => {
    const errors = [
      { code: 'required', source: 'firstName', severity: 'Error' }
    ];
    const nextState = reducer(initialState, {
      type: 'set-form-errors',
      payload: { errors, touchFields: false }
    });
    expect(nextState).toMatchObject({
      isValid: false,
      errors,
      touched: []
    });
  });

  it('should throw for non-existing action', () => {
    expect(() => reducer({}, { type: 'non-existing-action' })).toThrowError(
      'Unknown action: non-existing-action'
    );
  });
});
