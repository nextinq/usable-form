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

  it('should update existing error', () => {
    const errors = [{ code: 'required', source: 'firstName', severity: 'Error' }];
    const oldState = { ...initialState, errors };

    const nextState = reducer(oldState, {
      type: 'set-form-errors',
      payload: {
        errors: [{ code: 'invalid', source: 'firstName', severity: 'Error' }],
        touchFields: true
      }
    });
    expect(nextState).toMatchObject({
      isValid: false,
      errors: [{ code: 'invalid', source: 'firstName', severity: 'Error' }],
      touched: [errors[0].source]
    });
  });

  it('should append to existing errors', () => {
    const initErrors = [{ code: 'required', source: 'firstName', severity: 'Error' }];
    const newErrors = [{ code: 'invalid', source: 'lastName', severity: 'Error' }];
    const oldState = { ...initialState, errors: initErrors, touched: ['firstName'] };

    const nextState = reducer(oldState, {
      type: 'set-form-errors',
      payload: {
        errors: newErrors,
        touchFields: true
      }
    });
    expect(nextState).toMatchObject({
      isValid: false,
      errors: [...initErrors, ...newErrors],
      touched: ['firstName', 'lastName']
    });
  });

  it('should set form errors and touch erroneous fields', () => {
    const errors = [{ code: 'required', source: 'firstName', severity: 'Error' }];
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
    const errors = [{ code: 'required', source: 'firstName', severity: 'Error' }];
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
});
