// @ts-nocheck
import { isInputTouched, getInputError } from '../form-validation';
import { ValidationError } from '../../types';

describe('form-validation', () => {
  describe('isInputTouched', () => {
    it('should return true if touched', () => {
      expect(isInputTouched('field1', ['f1', 'field1'])).toBeTruthy();
    });
    it('should return false if not touched', () => {
      expect(isInputTouched('field1', ['f1'])).toBeFalsy();
    });
    it('should return false if touched array is not provided', () => {
      expect(isInputTouched('field1', null)).toBeFalsy();
    });
  });
  describe('getInputError', () => {
    const errors: Array<ValidationError> = [
      { code: 'required', source: 'field1', severity: 'Warning' }
    ];
    it('should return error if found', () => {
      expect(getInputError('field1', errors)).toEqual(errors[0]);
    });
    it('should return null if not found', () => {
      expect(getInputError('field42', errors)).toEqual(null);
    });
    it('should return null if errors array is not provided', () => {
      expect(getInputError('field1', null)).toEqual(null);
    });
  });
});
